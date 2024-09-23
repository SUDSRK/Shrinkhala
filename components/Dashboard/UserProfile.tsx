import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

type UserProfileProps = {
    name: string;
    userName: string;
    openModal: () => void;
    navigateToShareReport: () => void;
};

const UserProfile: React.FC<UserProfileProps> = ({ name, userName, openModal, navigateToShareReport }) => {
    const getInitials = (name: string) => {
        return name.split(" ").map((part) => part.charAt(0)).join("").toUpperCase();
    };

    return (
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
                    <MaterialIcons name="cloud-upload" size={width * 0.07} color="#0198A5" />
                    <Text style={styles.buttonText}>Upload Report</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={navigateToShareReport}>
                    <MaterialIcons name="share" size={width * 0.06} color="#0198A5" />
                    <Text style={styles.buttonText}>Share with Doctor</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        padding: width * 0.04,
    },
    profileContainer: {
        alignItems: "center",
        marginVertical: height * 0.02,
    },
    circularIcon: {
        width: width * 0.18,
        height: width * 0.18,
        borderRadius: (width * 0.18) / 2,
        backgroundColor: "#e4d8fc",
        justifyContent: "center",
        alignItems: "center",
    },
    initials: {
        color: "#7239EA",
        fontSize: width * 0.08,
        fontWeight: "bold",
    },
    userInfo: {
        fontSize: width * 0.045,
        marginVertical: height * 0.005,
        textAlign: "center",
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: height * 0.02,
    },
    button: {
        backgroundColor: "#e6f6f6",
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.03,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: width * 0.35,
    },
    buttonText: {
        color: "#0198A5",
        fontSize: width * 0.04,
        marginTop: height * 0.01,
        textAlign: "center",
    },
    divider: {
        borderBottomColor: "grey",
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: "100%",
    },
});

export default UserProfile;
