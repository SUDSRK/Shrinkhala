import React, { useState } from "react";
import {
    FlatList,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    RefreshControl,
    ActivityIndicator,
    Dimensions
} from "react-native";

// Get screen dimensions for responsiveness
const { width, height } = Dimensions.get("window");

type Report = {
    test_name: string;
    test_type: string;
    extracted_date: string;
    unique_file_path_name: string;
    test_type_1?: string;
};

type ReportListProps = {
    reports: Report[];
    activeSpan: string;
    setActiveSpan: (span: string) => void;
    handleDownload: (url: string) => void;
    handleView: (url: string) => void;
    refreshing: boolean;
    onRefresh: () => void;
};

const backgroundImage = require("../../assets/images/transparentbg.png");

const ReportList: React.FC<ReportListProps> = ({
                                                   reports,
                                                   activeSpan,
                                                   setActiveSpan,
                                                   handleDownload,
                                                   handleView,
                                                   refreshing,
                                                   onRefresh,
                                               }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchData = () => {
        setIsLoading(true);
        try {
            setTimeout(() => {
                setIsLoading(false);
                setError("");
            }, 1500);
        } catch (error) {
            setIsLoading(false);
            setError("Failed to fetch reports. Please try again.");
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const filteredReports = activeSpan === "All" ? reports : reports.filter(report => report.test_type === activeSpan);

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

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0198A5" />
                <Text style={styles.loadingText}>Loading reports...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
            <View style={styles.filterContainer}>
                {["All", "Blood", "Radiology", "Pathology"].map((span) => (
                    <TouchableOpacity
                        key={span}
                        onPress={() => setActiveSpan(span)}
                        style={[styles.filterButton, activeSpan === span && styles.activeFilter]}
                    >
                        <Text style={[styles.filterText, activeSpan === span && styles.activeFilterText]}>
                            {span}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {filteredReports.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No reports available.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredReports}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    renderItem={({ item }) => {
                        const { textColor, bgColor } = getTestTypeColor(item.test_type);

                        return (
                            <View style={styles.reportItem}>
                                <View style={styles.reportLeftContainer}>
                                    <Text style={styles.reportTitle}>Report Name: {item.test_name}</Text>
                                    <Text style={styles.reportSubtitle}>Test Type: {item.test_type}</Text>
                                    <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(item.unique_file_path_name)}>
                                        <Text style={styles.downloadButtonText}>Download</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.reportRightContainer}>
                                    <Text style={[styles.testType, { backgroundColor: bgColor, color: textColor }]}>
                                        {item.test_type}
                                    </Text>
                                    <Text style={styles.reportDate}>{item.extracted_date}</Text>
                                    <TouchableOpacity style={styles.viewButton} onPress={() => handleView(item.unique_file_path_name)}>
                                        <Text style={styles.viewButtonText}>View</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                    ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                    contentContainerStyle={{ paddingBottom: height * 0.1 }}
                />
            )}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: height * 0.02,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    filterButton: {
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        borderRadius: 18,
        backgroundColor: "#e0e0e0",
    },
    activeFilter: {
        backgroundColor: "#0198A5",
    },
    filterText: {
        color: "#090808",
        fontSize: width * 0.04,
    },
    activeFilterText: {
        color: "white",
    },
    reportItem: {
        flexDirection: "row",
        padding: height * 0.010,
        marginVertical: height * 0.01,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "white",
        marginHorizontal: width * 0.01,
    },
    reportLeftContainer: {
        flex: 2.5,
    },
    reportRightContainer: {
        flex: 1.5,
        alignItems: "center",
        justifyContent: "center",
    },
    reportTitle: {
        fontWeight: "bold",
        fontSize: width * 0.038,
    },
    reportSubtitle: {
        fontSize: width * 0.029,
        marginTop: height * 0.01,
        marginBottom: height * 0.015,
    },
    downloadButton: {
        backgroundColor: "#0198A5",
        borderRadius: 16,
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.05,
        alignSelf: "flex-start",
    },
    downloadButtonText: {
        color: "white",
        fontSize: width * 0.04,
        textAlign: "center",
    },
    testType: {
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.02,
        borderRadius: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: height * 0.01,
        fontSize: width * 0.03,
    },
    reportDate: {
        fontSize: width * 0.03,
        marginVertical: height * 0.01,
        color: "#666",
    },
    viewButton: {
        backgroundColor: "#0198A5",
        borderRadius: 16,
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.05,
        marginTop: height * 0.01,
    },
    viewButtonText: {
        color: "white",
        fontSize: width * 0.04,
        textAlign: "center",
    },
    itemSeparator: {
        height: height * 0.01,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: height * 0.02,
        fontSize: width * 0.05,
        color: "#0198A5",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: width * 0.05,
        marginBottom: height * 0.02,
    },
    retryButton: {
        backgroundColor: "#0198A5",
        padding: height * 0.02,
        borderRadius: 10,
    },
    retryButtonText: {
        color: "white",
        fontSize: width * 0.04,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noDataText: {
        color: "#666",
        fontSize: width * 0.05,
    },
});

export default ReportList;
