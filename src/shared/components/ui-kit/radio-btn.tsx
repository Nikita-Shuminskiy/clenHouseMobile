import React from "react";
import { TouchableOpacity, View } from "react-native";

import { HARVEST_COLORS } from "../../harvest-theme";
import Typography from "./typography";

interface IRadioBtn {
    onPress: () => void;
    val: boolean;
    title: string;
    disabled?: boolean;
}

const RadioBtn: React.FC<IRadioBtn> = ({ onPress, val, title, disabled }) => {

    return (
        <TouchableOpacity
            disabled={disabled}
            style={{ gap: 10, flexDirection: "row", opacity: 1 }}
            onPress={onPress}
        >
            <View
                style={{
                    width: 20,
                    height: 20,
                    backgroundColor: HARVEST_COLORS.paper,
                    borderColor: HARVEST_COLORS.bone,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderRadius: 20,
                }}
            >
                {val && (
                    <View
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: HARVEST_COLORS.flame,
                        }}
                    />
                )}
            </View>
            <Typography style={{ color: HARVEST_COLORS.ink, flex: 1, flexShrink: 1 }} size={14} weight="600">
                {title}
            </Typography>
        </TouchableOpacity>
    );
};

export default RadioBtn;
