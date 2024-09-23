import React from "react";
import { FlatList, View, Text, TouchableOpacity, StyleSheet, ImageBackground, RefreshControl } from "react-native";
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
    refreshing: boolean; // New prop for refreshing state
    onRefresh: () => void; // New prop for handling refresh
};
// Import the background image
const backgroundImage = require("../../assets/images/transparentbg.png");

const ReportList: React.FC<ReportListProps> = ({ reports, activeSpan, setActiveSpan, handleDownload, handleView,     refreshing,
                                                   onRefresh, }) => {
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

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
            {/* Fixed Filter Tabs */}
            <View style={styles.filterContainer}>
                {["All", "Blood", "Radiology", "Pathology"].map((span) => (
                    <TouchableOpacity
                        key={span}
                        onPress={() => setActiveSpan(span)}
                        style={[styles.filterButton, activeSpan === span && styles.activeFilter]}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                activeSpan === span && styles.activeFilterText // Apply active text color
                            ]}
                        >
                            {span}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* FlatList for the reports */}
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
                contentContainerStyle={{ paddingBottom: 80 }} // Added padding to prevent the last item from being hidden
            />

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
        paddingVertical: 10,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    filterButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 18,
        backgroundColor: "#e0e0e0",
    },
    activeFilter: {
        backgroundColor: "#0198A5",
    },
    filterText: {
        color: "#090808",
        fontSize: 16,
    },
    activeFilterText: {
        color: "white",
    },
    reportItem: {
        flexDirection: "row",
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "white",
        marginHorizontal: 5,
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
    },
    reportSubtitle: {
        fontSize: 13,
        marginTop: 4,
        marginBottom: 10,
    },
    downloadButton: {
        backgroundColor: "#0198A5",
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 15,
        alignSelf: "flex-start",
    },
    downloadButtonText: {
        color: "white",
        fontSize: 14,
        textAlign: "center",
    },
    testType: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
        fontSize: 12,
    },
    reportDate: {
        fontSize: 12,
        marginVertical: 5,
        color: "#666",
    },
    viewButton: {
        backgroundColor: "#0198A5",
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 15,
        marginTop: 5,
    },
    viewButtonText: {
        color: "white",
        fontSize: 14,
        textAlign: "center",
    },
    itemSeparator: {
        height: 10,
    },
});

export default ReportList;
