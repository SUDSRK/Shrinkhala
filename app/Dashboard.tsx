import React, { useState, useEffect, useCallback } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Alert,
    Linking,
    Dimensions,
    BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserProfile from "../components/Dashboard/UserProfile";
import ReportList from "../components/Dashboard/ReportList";
import UploadModals from "../components/Dashboard/UploadModals";
import CameraCapture from "../components/Dashboard/CameraCapture";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

// Get screen dimensions for responsiveness
const { width, height } = Dimensions.get("window");

type Report = {
    test_name: string;
    test_type: string;
    extracted_date: string;
    unique_file_path_name: string;
    test_type_1?: string;
};

const Dashboard = () => {
    const [userName, setUserName] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [reports, setReports] = useState<Report[]>([]);
    const [activeSpan, setActiveSpan] = useState<string>("All");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showSecondModal, setShowSecondModal] = useState<boolean>(false);
    const [cameraVisible, setCameraVisible] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("Home");
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            setShowModal(false);
            setShowSecondModal(false);
            setCameraVisible(false);

            const backAction = () => {
                Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel",
                    },
                    { text: "OK", onPress: () => BackHandler.exitApp() },
                ]);
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );

            return () => backHandler.remove();
        }, [])
    );

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserName = await AsyncStorage.getItem("userName");
                const storedName = await AsyncStorage.getItem("fullName");
                if (storedUserName) setUserName(storedUserName);
                if (storedName) setName(storedName);
            } catch (error) {
                console.error("Failed to load user data from storage", error);
                navigation.navigate("Welcome");
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
            const response = await fetch(
                `https://extract.shrinkhala.in/reports/${userName}`
            );
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

    const openModal = () => setShowModal(true);
    const closeModals = () => {
        setShowModal(false);
        setShowSecondModal(false);
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

    const handleUploadPDF = async () => {
        setShowSecondModal(false);
        setShowModal(false);
        const permissionGranted = await getPermission();
        if (!permissionGranted) return;
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

    const handleUploadImage = async () => {
        setShowModal(false);
        setShowSecondModal(false);
        const permissionGranted = await getPermission();
        if (!permissionGranted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            selectionLimit: 5,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedFiles = result.assets.slice(0, 5).map((file) => ({
                uri: file.uri,
                type: file.mimeType,
                name: file.fileName || `file_${Date.now()}`,
            }));
            navigation.navigate("Preview", { files: selectedFiles, userName });
        } else {
            Alert.alert("No file selected", "Please select a file.");
        }
    };

    const handleCaptureImage = async () => {
        setShowSecondModal(false);
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            await ImagePicker.requestCameraPermissionsAsync();
        }
        setCameraVisible(true);
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

    const handleView = (url: string) => {
        navigation.navigate("reportViewer", { url });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <UserProfile
                    name={name}
                    userName={userName}
                    openModal={openModal}
                    navigateToShareReport={() => navigation.navigate("ShareReport")}
                />
                <ReportList
                    reports={reports}
                    activeSpan={activeSpan}
                    setActiveSpan={setActiveSpan}
                    handleDownload={handleDownload}
                    handleView={handleView}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
                <UploadModals
                    showModal={showModal}
                    showSecondModal={showSecondModal}
                    closeModals={closeModals}
                    handleUploadPDF={handleUploadPDF}
                    handleUploadImage={handleUploadImage}
                    handleCaptureImage={handleCaptureImage}
                    openSecondModal={() => setShowSecondModal(true)}
                />
                <CameraCapture
                    cameraVisible={cameraVisible}
                    closeCamera={() => setCameraVisible(false)}
                    userName={userName}
                />
            </View>

            <View style={styles.footerContainer}>
                <TouchableOpacity
                    style={styles.footerTab}
                    onPress={() => {
                        setActiveTab("Profile");
                        navigation.navigate("Profile");
                    }}
                >
                    <MaterialIcons
                        name="person"
                        size={width * 0.08}
                        color={activeTab === "Profile" ? "#0198A5" : "grey"}
                    />
                    <Text
                        style={[
                            styles.footerTabText,
                            activeTab === "Profile" && styles.activeFooterTabText,
                        ]}
                    >
                        Profile
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.footerTab}
                    onPress={() => setActiveTab("Home")}
                >
                    <MaterialIcons
                        name="home"
                        size={width * 0.08}
                        color={activeTab === "Home" ? "#0198A5" : "grey"}
                    />
                    <Text
                        style={[
                            styles.footerTabText,
                            activeTab === "Home" && styles.activeFooterTabText,
                        ]}
                    >
                        Home
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        marginTop: height * 0.02,
        paddingHorizontal: width * 0.03,
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingVertical: height * 0.01,
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    footerTab: {
        alignItems: "center",
        paddingVertical: height * 0.005,
    },
    footerTabText: {
        color: "grey",
        marginTop: height * 0.005,
        fontSize: width * 0.03,
    },
    activeFooterTabText: {
        color: "#0198A5",
    },
});

export default Dashboard;
