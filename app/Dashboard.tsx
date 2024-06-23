import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ImageBackground,
    Alert,
    Linking,
    SafeAreaView,
    StyleSheet,
    FlatList,
    RefreshControl
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from "expo-document-picker";
const backgroundImage = require("../assets/images/transparentbg.png");
const whiteimg = require("../assets/images/white.png");

type Report = {
    test_name: string;
    test_type: string;
    extracted_date: string;
    unique_file_path_name: string;
    test_type_1?: string;
};

const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        console.log(
            "Permission not granted",
            "Please grant the permission to access documents on your device."
        );
        return false;
    }
    return true;
};

const Dashboard = () => {
    const [userName, setUserName] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [pdfSource, setPdfSource] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showSecondModal, setShowSecondModal] = useState<boolean>(false);
    const [reports, setReports] = useState<Report[]>([]);
    const [activeSpan, setActiveSpan] = useState<string>("All");
    const [activeTab, setActiveTab] = useState<string>("Home");
    const [cameraVisible, setCameraVisible] = useState<boolean>(false);
    const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const navigation = useNavigation();
    const cameraRef = useRef(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserName = await AsyncStorage.getItem('userName');
                const storedName = await AsyncStorage.getItem('fullName');

                if (storedUserName) {
                    setUserName(storedUserName);
                }
                if (storedName) {
                    setName(storedName);
                }
            } catch (error) {
                console.error('Failed to load user data from storage', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userName) {
            fetchReports();
        }
    }, [userName]);

    const fetchReports = async () => {
        try {
            const response = await fetch(`https://extract.shrinkhala.in/reports/${userName}`);
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports data:", error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchReports();
        setRefreshing(false);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleDownload = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        } catch (error) {
            console.error("Error downloading report:", error);
        }
    };

    const handleUploadPDFReport = async () => {
        setShowSecondModal(false)

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
            });
            console.log(result);
            if (!result.canceled) {
                const pdfFileUri = result.assets[0].uri;
                if (pdfFileUri) {
                    const fileInfo = await FileSystem.getInfoAsync(pdfFileUri);
                    if (fileInfo.exists) {
                        navigation.navigate("PreviewPDF", { uri: pdfFileUri, userName });
                    } else {
                        console.error("Error: File does not exist");
                    }
                } else {
                    console.error("Error: PDF data is null");
                }
            }
        } catch (err) {
            console.error("Error uploading PDF:", err);
        }
    };

    const handleUploadImageReport = async () => {
        setShowSecondModal(false)
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: false, // Allow only single selection
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedFile = result.assets[0];
            const file = {
                uri: selectedFile.uri,
                type: selectedFile.mimeType,
                name: selectedFile.fileName || `file_${Date.now()}`, // Assign a default name if not provided
            };
            closeModal();
            navigation.navigate('Preview', { file, userName });
        } else {
            Alert.alert('No file selected', 'Please select a file.');
        }
    };

    const handleCaptureImage = async () => {
        setShowSecondModal(false)
        if (!permission) {
            return;
        }

        if (!permission.granted) {
            await requestPermission();
        }

        setCameraVisible(true);
    };

    const getTestTypeColor = (testType: string) => {
        switch (testType) {
            case "Blood":
                return { textColor: "#F1416C", bgColor: "#F1416C1A" };
            case "Radiology":
                return { textColor: "#01A52F", bgColor: "#01A52F1A" };
            case "Pathology":
                return { textColor: "#278AE6", bgColor: "#278AE61A" };
            default:
                return { textColor: "#000000", bgColor: "#FFFFFF" };
        }
    };

    const handleView = (url: string) => {
        navigation.navigate("reportViewer", { url });
    };

    const handleSpanClick = (span: string) => {
        setActiveSpan(span);
    };

    const filteredReports =
        activeSpan === "All"
            ? reports
            : reports.filter(
                (report) =>
                    report.test_type === activeSpan ||
                    (activeSpan === "Blood test" && report.test_type_1 === "B")
            );

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase();
    };

    const handleUploadOption = () => {
        setShowModal(false);
        setShowSecondModal(true);
    };

    const handleTakePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log(photo);
            setCameraVisible(false);
            navigation.navigate("PreviewCamera", { file: photo, userName });
        }
    };

    const toggleCameraType = () => {
        setCameraType(current => (current === 'back' ? 'front' : 'back'));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <FlatList
                    data={filteredReports}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListHeaderComponent={() => (
                        <>

                            <View style={styles.overlay}>
                                <View style={styles.profileContainer}>
                                    <View style={styles.circularIcon}>
                                        <Text style={styles.initials}>{getInitials(name)}</Text>
                                    </View>
                                    <Text style={styles.userInfo}>Patient: {name}</Text>
                                    <Text style={styles.userInfo}>UID No: {userName}</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.actionsContainer}>
                                    <TouchableOpacity style={styles.button} onPress={openModal}>
                                        <MaterialIcons
                                            name="cloud-upload"
                                            size={28}
                                            color="#0198A5"
                                            style={styles.icon}
                                        />
                                        <Text style={styles.buttonText}>Upload Report</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => navigation.navigate("ShareReport")}
                                    >
                                        <MaterialIcons
                                            name="share"
                                            size={24}
                                            color="#0198A5"
                                            style={styles.icon}
                                        />
                                        <Text style={styles.buttonText}>Share with Doctor</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.divider} />
                                <ImageBackground source={backgroundImage} resizeMode="cover">
                                    <View style={{ paddingTop: 10 }}>
                                        <Text style={{ fontSize: 20 }}>Your Reports</Text>
                                    </View>
                                    <View style={styles.filterContainer}>
                                        <TouchableOpacity
                                            onPress={() => handleSpanClick("All")}
                                            style={[
                                                styles.filterButton,
                                                activeSpan === "All" && styles.activeFilter,
                                            ]}
                                        >
                                            <Text style={styles.filterText}>All</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleSpanClick("Blood test")}
                                            style={[
                                                styles.filterButton,
                                                activeSpan === "Blood test" && styles.activeFilter,
                                            ]}
                                        >
                                            <Text style={styles.filterText}>Blood test</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleSpanClick("Radiology")}
                                            style={[
                                                styles.filterButton,
                                                activeSpan === "Radiology" && styles.activeFilter,
                                            ]}
                                        >
                                            <Text style={styles.filterText}>Radiology</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleSpanClick("Pathology")}
                                            style={[
                                                styles.filterButton,
                                                activeSpan === "Pathology" && styles.activeFilter,
                                            ]}
                                        >
                                            <Text style={styles.filterText}>Pathology</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ImageBackground>
                            </View>
                        </>
                    )}
                    renderItem={({ item }) => (
                            <ImageBackground source={backgroundImage} resizeMode="cover">
                                <View style={styles.reportItem}>
                                    <View style={styles.reportLeftContainer}>
                                        <Text style={styles.reportTitle}>
                                            Report Name: {item.test_name}
                                        </Text>
                                        <Text style={styles.reportSubtitle}>
                                            Test Type: {item.test_type}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.btn}
                                            onPress={() => handleDownload(item.unique_file_path_name)}
                                        >
                                            <Text style={styles.btnText}>Download</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.reportRightContainer}>
                                        <Text
                                            style={[
                                                styles.testType,
                                                {
                                                    backgroundColor: getTestTypeColor(item.test_type)
                                                        .bgColor,
                                                    color: getTestTypeColor(item.test_type).textColor,
                                                },
                                            ]}
                                        >
                                            {item.test_type}
                                        </Text>
                                        <Text style={styles.reportDate}>
                                            {item.extracted_date}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.btnView}
                                            onPress={() => handleView(item.unique_file_path_name)}
                                        >
                                            <Text style={styles.btnViewColor}>View</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ImageBackground>

                    )}
                    contentContainerStyle={{ paddingBottom: 70 }}
                />
                <Modal visible={showModal} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.modalClose}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={styles.modalCloseText}>&times;</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Upload a new Report</Text>
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={handleUploadOption}
                            >
                                <Text style={styles.uploadButtonText}>From Phone</Text>
                            </TouchableOpacity>
                            <Text style={styles.orText}>OR</Text>
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={handleCaptureImage}
                            >
                                <Text style={styles.uploadButtonText}>Scan report</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showSecondModal}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.customModalContainer}>
                        <View style={styles.customModalContent}>
                            <Text style={styles.modalTitle}>Select Upload Type</Text>
                            <TouchableOpacity
                                onPress={handleUploadPDFReport}
                                style={styles.uploadOption}
                            >
                                <Text style={styles.uploadOptionText}>Upload PDF</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleUploadImageReport}
                                style={[styles.uploadOption, styles.lastUploadOption]}
                            >
                                <Text style={styles.uploadOptionText}>Upload Image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalClose}
                                onPress={() => setShowSecondModal(false)}
                            >
                                <Text style={styles.modalCloseText}>&times;</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => {
                            setActiveTab("Profile");
                            navigation.navigate("Profile");
                        }}
                    >
                        <MaterialIcons
                            name="person"
                            size={30}
                            color={activeTab === "Profile" ? "#0198A5" : "grey"}
                        />
                        <Text
                            style={[styles.tabText, activeTab === "Profile" && styles.activeTabText]}
                        >
                            Profile
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("Home")}>
                        <MaterialIcons
                            name="home"
                            size={30}
                            color={activeTab === "Home" ? "#0198A5" : "grey"}
                        />
                        <Text
                            style={[styles.tabText, activeTab === "Home" && styles.activeTabText]}
                        >
                            Home
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <Modal visible={cameraVisible} transparent={true}>
                <View style={{ flex: 1, backgroundColor: "black" }}>
                    <CameraView style={{ flex: 1 }} facing={cameraType} ref={cameraRef}>
                        <View style={styles.cameraContainer}>
                            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
                                <Text style={styles.flipText}>Flip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
                                <Text style={styles.captureText}>Capture</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.backButton} onPress={() => setCameraVisible(false)}>
                                <Text style={styles.backText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        // marginTop: 25,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "contain",
        height: 'auto',
        paddingTop: 20,
    },
    backgroundImage2: {
        flex: 1,
        resizeMode: "contain",
        height: 'auto',
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 1)",
        padding: 5,
    },
    container: { flex: 1, padding: 20 },
    profileContainer: { alignItems: "center", marginVertical: 20 },
    circularIcon: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: "#e4d8fc",
        justifyContent: "center",
        alignItems: "center",
    },
    initials: { color: "#7239EA", fontSize: 32, fontWeight: "bold" },
    userInfo: { fontSize: 18, marginVertical: 5 },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 20,
    },
    button: {
        backgroundColor: "#e6f6f6",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        paddingVertical: 40,
    },
    buttonText: { color: "#0198A5", fontSize: 16, marginTop: 5 },
    icon: { marginBottom: 5 },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 20 },
    filterButton: { padding: 10, borderRadius: 18, backgroundColor: "#e0e0e0" },
    activeFilter: { backgroundColor: "#0198A5" },
    filterText: { color: "white", fontSize: 16 },
    reportInfo: { marginBottom: 10 },
    buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingVertical: 0,
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    tab: {
        alignItems: "center",
        paddingVertical: 10,
    },
    tabText: {
        color: "grey",
        marginTop: 5,
    },
    activeTabText: {
        color: "#0198A5",
    },
    btn: {
        backgroundColor: "#e6f6f6",
        borderRadius: 15,
        padding: 6,
        width: 100,
        alignItems: "center",
    },
    btnView: {
        backgroundColor: "#0198A5",
        borderRadius: 15,
        padding: 6,
        width: 60,
        alignItems: "center",
        color: "white",
    },
    btnViewColor: {
        color: "white",
    },
    btnText: {
        color: "#0198A5",
    },
    reportItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "white",
    },
    testType: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
    },
    reportLeftContainer: {
        flex: 1,
    },
    reportRightContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },
    reportTitle: {
        fontWeight: "bold",
    },
    reportSubtitle: {
        fontSize: 13,
        marginTop: 5,
    },
    reportDate: {
        fontSize: 13,
        marginTop: 5,
    },
    divider: {
        borderBottomColor: "grey",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalClose: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    modalCloseText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
    },
    modalTitle: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    uploadButton: {
        backgroundColor: "#0198A5",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    uploadButtonText: {
        color: "white",
        fontSize: 16,
    },
    orText: {
        fontSize: 16,
        marginVertical: 10,
    },
    customModalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    customModalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    uploadOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    lastUploadOption: {
        borderBottomWidth: 0,
    },
    uploadOptionText: {
        fontSize: 16,
        textAlign: "center",
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        padding: 20,
    },
    captureButton: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
    },
    captureText: {
        fontSize: 16,
        color: "black",
    },
    flipButton: {
        position: "absolute",
        top: 20,
        left: 20,
    },
    flipText: {
        fontSize: 18,
        color: "white",
    },
    backButton: {
        position: "absolute",
        top: 20,
        right: 20,
    },
    backText: {
        fontSize: 18,
        color: "white",
    },
});

export default Dashboard;
