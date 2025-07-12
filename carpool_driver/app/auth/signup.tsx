import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Layout from "@/constants/layout";
import { useRouter } from "expo-router";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext"; // 👈 bạn đã lưu ý điều này

import {
  Lock,
  Mail,
  Phone,
  User,
  Car,
  Palette,
  Hash,
  Users,
} from "lucide-react-native";
import ImageUploader from "@/components/ImageUploader";
import { api } from "@/services/api";
import { registerReqDto } from "@/types/auth";
import { BackgroundTaskManager } from "@/services/process";
import axios from "axios";
import { CustomModal } from "@/components/Modal";

export default function SignupScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const [body, setBody] = useState<registerReqDto>();
  const [loading, setLoading] = useState(false);

  const handleFinalSubmit = useCallback(
    async (reqDto: registerReqDto) => {
      setLoading(true);
      try {
        if (!reqDto) throw Error("no body!!");
        console.log(reqDto);
        const result = await api.auth.register(reqDto);
        console.log(result.data);
        Alert.alert(
          "Đăng ký thành công",
          "Bạn sẽ được chuyển về màn hình đăng nhập.",
          [
            {
              text: "OK",
              onPress: () => router.push("/auth/login"),
            },
          ]
        );

        // await BackgroundTaskManager.registerTask(
        //   "UPLOAD_IMAGES_TASK",
        //   async () => {
        //     // return await Promise.all(uploadFiles(result.data, documents));
        //   },
        //   {
        //     minimumInterval: 60 * 60,
        //     stopOnTerminate: false,
        //     startOnBoot: true,
        //   }
        // );
      } catch (error) {
        console.log(error);
        Alert.alert("Đăng ký thất bại", error + "");
      } finally {
        setLoading(false);
      }
    },
    [body]
  );

  // const uploadFiles = async (url: string, documents: any) => {
  //   uploadUrls.map((url, index) =>
  //     axios
  //       .put(url, documents[index], {
  //         headers: { "Content-Type": "image/jpeg" },
  //       })
  //       .catch((err) => {
  //         console.error(
  //           `Upload failed for image ${documents[index].name}: `,
  //           err
  //         );
  //       })
  //   );
  // };

  // follow
  const [step, setStep] = useState(0);
  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setStep((prev) => prev - 1), []);
  const renderStepContent = useCallback(() => {
    switch (step) {
      case 0:
        return (
          <SignupStep1
            colors={colors}
            t={t}
            router={router}
            onNext={(phone: string) => {
              setBody({ phone } as registerReqDto);
              nextStep();
            }}
          />
        );
      case 1:
        return (
          <SignupStep2
            colors={colors}
            t={t}
            onNext={(val: {}) => {
              setBody((prev) => ({
                ...prev,
                ...(val as registerReqDto),
              }));
              nextStep();
            }}
          />
        );
      case 2:
        return (
          <SignupStep3
            colors={colors}
            t={t}
            onNext={(val: {}) => {
              setBody((prev) => ({
                ...prev,
                ...(val as registerReqDto),
              }));
              nextStep();
            }}
          />
        );
      case 3:
        return (
          <SignupStep4
            colors={colors}
            t={t}
            onComplete={(val: {}) => {
              const updatedBody = {
                ...body,
                ...(val as registerReqDto),
                role: "driver",
              };
              setBody(updatedBody);
              handleFinalSubmit(updatedBody);
            }}
          />
        );
      default:
        null;
    }
  }, [step]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <Modal
          visible={loading}
          style={{
            backgroundColor: colors.overlay,
            width: "auto",
            height: "auto",
          }}
        >
          <Text>Loading...</Text>
        </Modal>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t("create_account")}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {t("step")} {step + 1} / 4
              </Text>
              {step > 0 && step < 4 && (
                <TouchableOpacity onPress={prevStep} style={styles.backButton}>
                  <Text style={{ color: colors.primary }}>{t("back")}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.form}>{renderStepContent()}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SignupStep1({ colors, router, t, onNext }: any) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    phone: "",
    otp: "",
  });

  const countdownRef = useRef(300);
  const [countdown, setCountdown] = useState(countdownRef.current);

  const validateForm = useCallback(() => {
    let isValid = true;
    const errors = {
      phone: "",
      otp: "",
    };

    if (!phone) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ""))) {
      errors.phone = "Phone number is invalid";
      isValid = false;
    }

    if (isOtpSent && otp.length !== 6) {
      errors.otp = "OTP must be 6 digits";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  }, [phone, otp, isOtpSent]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdownRef.current > 0) {
        countdownRef.current -= 1;
        setCountdown(countdownRef.current); // Cập nhật countdown
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer); // Dọn dẹp khi component unmount
  }, []);

  const handleSendOtp = useCallback(() => {
    if (validateForm()) {
      setIsOtpSent(true);
      countdownRef.current = 300; // Đặt lại thời gian đếm ngược
      setCountdown(countdownRef.current);
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        setErrorMessage(""); // Reset lỗi
      }, 2000);
    }
  }, [validateForm]);

  const handleVerifyOtp = useCallback(() => {
    if (otp.length === 6) {
      onNext(phone);
    }
  }, [otp, router]);

  const handleLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  return (
    <>
      <View style={styles.form}>
        <Input
          colors={colors}
          label={t("phone_number")}
          placeholder={t("enter_phone")}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leftIcon={<Phone size={20} color={colors.gray} />}
          error={validationErrors.phone}
        />

        {!isOtpSent ? (
          <Button
            colors={colors}
            title={t("send_otp")}
            onPress={handleSendOtp}
            isLoading={isLoading}
          />
        ) : (
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  marginBottom: Layout.spacing.l,
                }}
              >
                {t("otp")} ({Math.floor(countdown / 60)}:{countdown % 60})
              </Text>
              {countdown === 0 && (
                <TouchableOpacity onPress={handleSendOtp}>
                  <Text style={{ color: colors.primary, textAlign: "right" }}>
                    {t("resend_otp")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Input
              colors={colors}
              // label={""}
              label={t("enter_otp")}
              placeholder={t("enter_otp")}
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
              leftIcon={<Lock size={20} color={colors.gray} />}
              error={validationErrors.otp}
            />
            <Button
              colors={colors}
              title={t("verify")}
              onPress={handleVerifyOtp}
              isLoading={isLoading}
              disabled={otp.length !== 6 || !isOtpSent}
            />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          {t("already_have_account")}
        </Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={[styles.loginText, { color: colors.primary }]}>
            {t("login")}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

function SignupStep2({ colors, t, onNext }: any) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: "" });
  };

  const handleNext = () => {
    const newErrors: typeof errors = {
      firstName: form.firstName ? "" : t("error_required"),
      lastName: form.lastName ? "" : t("error_required"),
      email: /\S+@\S+\.\S+/.test(form.email) ? "" : t("error_email"),
      password: form.password.length >= 6 ? "" : t("error_password"),
      confirmPassword:
        form.confirmPassword === form.password
          ? ""
          : t("error_confirm_password"),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e !== "");
    if (!hasError) {
      onNext(form);
    }
  };

  return (
    <>
      <View style={styles.nameRow}>
        <Input
          label={t("first_name")}
          placeholder={t("first_name")}
          value={form.firstName}
          onChangeText={(text) => {
            handleChange("firstName", text);
          }}
          colors={colors}
          leftIcon={<User size={20} color={colors.gray} />}
          containerStyle={styles.nameInput}
          require
        />
        <Input
          label={t("last_name")}
          placeholder={t("last_name")}
          value={form.lastName}
          onChangeText={(text) => {
            handleChange("lastName", text);
          }}
          colors={colors}
          leftIcon={<User size={20} color={colors.gray} />}
          containerStyle={styles.nameInput}
          require
        />
      </View>
      <Input
        label={t("email")}
        placeholder={t("enter_email")}
        value={form.email}
        onChangeText={(text) => {
          handleChange("email", text);
        }}
        colors={colors}
        keyboardType="email-address"
        leftIcon={<Mail size={20} color={colors.gray} />}
        require
      />
      <Input
        label={t("password")}
        placeholder={t("create_password")}
        value={form.password}
        onChangeText={(text) => {
          handleChange("password", text);
        }}
        colors={colors}
        isPassword
        leftIcon={<Lock size={20} color={colors.gray} />}
        require
      />
      <Input
        label={t("confirm_password")}
        placeholder={t("confirm_password")}
        value={form.confirmPassword}
        onChangeText={(text) => {
          handleChange("confirmPassword", text);
        }}
        colors={colors}
        isPassword
        leftIcon={<Lock size={20} color={colors.gray} />}
        require
      />
      <Button title={t("next")} onPress={handleNext} colors={colors} />
    </>
  );
}

function SignupStep3({ colors, t, onNext }: any) {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    type: "",
    make: "",
    vehicleModel: "",
    color: "",
    licensePlate: "",
    seats: "",
  });

  const [errors, setErrors] = useState({
    type: "",
    make: "",
    vehicleModel: "",
    color: "",
    licensePlate: "",
    seats: "",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: "" });
  };

  const validateForm = () => {
    const newErrors = {
      type: form.type ? "" : t("error_required"),
      make: form.make ? "" : t("error_required"),
      vehicleModel: form.vehicleModel ? "" : t("error_required"),
      color: form.color ? "" : t("error_required"),
      licensePlate: /^[A-Z0-9-]{6,10}$/.test(form.licensePlate)
        ? ""
        : t("error_plate_number"),
      seats: parseInt(form.seats) > 0 ? "" : t("error_max_seats"),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== "");
  };

  const handleNext = useCallback(() => {
    if (validateForm()) {
      onNext({ vehicle: form });
    }
  }, [form]);

  const _renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.selectionItem}
      onPress={() => {
        handleChange("type", item);
        setVisible(false);
      }}
    >
      <Text style={styles.selectionItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setVisible(true);
        }}
      >
        <Input
          label={t("vehicle_type")}
          placeholder={t("vehicle_type_placeholder")}
          value={form.type}
          editable={false}
          colors={colors}
          leftIcon={<Car size={20} color={colors.gray} />}
          error={errors.type}
          require
        />
      </TouchableOpacity>

      <CustomModal
        isVisible={visible}
        onClose={() => {
          setVisible(false);
        }}
        title="Chọn loai xe"
      >
        <FlatList
          data={["standard", "vip", "limousine", "minibus"]}
          renderItem={_renderItem}
          keyExtractor={(item) => item}
          style={styles.selectionList}
          showsVerticalScrollIndicator={false}
        />
      </CustomModal>

      <Input
        label={t("car_brand")}
        placeholder={t("car_brand_placeholder")}
        value={form.make}
        onChangeText={(text) => handleChange("make", text)}
        colors={colors}
        leftIcon={<Car size={20} color={colors.gray} />}
        error={errors.make}
        require
      />

      <Input
        label={t("vehicle_model")}
        placeholder={t("vehicle_model_placeholder")}
        value={form.vehicleModel}
        onChangeText={(text) => handleChange("vehicleModel", text)}
        colors={colors}
        leftIcon={<Car size={20} color={colors.gray} />}
        error={errors.vehicleModel}
        require
      />

      <Input
        label={t("vehicle_color")}
        placeholder={t("vehicle_color_placeholder")}
        value={form.color}
        onChangeText={(text) => handleChange("color", text)}
        colors={colors}
        leftIcon={<Palette size={20} color={colors.gray} />}
        error={errors.color}
        require
      />

      <Input
        label={t("plate_number")}
        placeholder={t("plate_number_placeholder")}
        value={form.licensePlate}
        onChangeText={(text) => handleChange("licensePlate", text)}
        colors={colors}
        leftIcon={<Hash size={20} color={colors.gray} />}
        error={errors.licensePlate}
        require
      />

      <Input
        label={t("max_seats")}
        placeholder={t("max_seats_placeholder")}
        value={form.seats}
        onChangeText={(text) => handleChange("seats", text)}
        keyboardType="numeric"
        colors={colors}
        leftIcon={<Users size={20} color={colors.gray} />}
        error={errors.seats}
        require
      />

      <Button title={t("next")} onPress={handleNext} colors={colors} />
    </>
  );
}

function SignupStep4({ colors, t, onComplete }: any) {
  const [documents, setDocuments] = useState<AllDocuments>({});
  const [error, setError] = useState<{ [key: string]: string }>({});

  const handleDocumentChange = useCallback((key: string, value: Documents) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (value.document.length == 0) {
      setError((pre) => ({
        ...pre,
        [key]: t("error_required"),
      }));
    } else {
      setError((pre) => ({
        ...pre,
        [key]: "",
      }));
    }
  }, []);

  const handleNext = useCallback(() => {
    let docArray: Documents[] = [];

    documentFields.forEach((key) => {
      const doc = documents[key];
      if (!doc || doc.document.length === 0) {
        setError((pre) => ({
          ...pre,
          [key]: t("error_required"),
        }));
      } else docArray.push(doc);
    });
    if (docArray.length == 7) onComplete({ documents: docArray });
  }, [documents, t, onComplete]);

  const documentItems = useMemo(() => {
    return documentFields.map((key) => (
      <Step4Item
        key={key}
        fieldKey={key}
        colors={colors}
        error={error[key]}
        t={t}
        docs={documents[key]}
        onChange={(val: Documents) => {
          handleDocumentChange(key, val);
        }}
      />
    ));
  }, [documents, colors, t, handleDocumentChange, error]);

  return (
    <View style={{ gap: 16 }}>
      {documentItems}
      <Button title={t("submit")} onPress={handleNext} colors={colors} />
    </View>
  );
}

function Step4Item({
  fieldKey,
  colors,
  t,
  docs,
  onChange,
  error,
}: {
  fieldKey: string;
  colors: any;
  t: any;
  docs: Documents;
  onChange: any;
  error: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <ImageUploader
        colors={colors}
        label={t(fieldKey)}
        error={error}
        onImagesChange={(images: string[]) => {
          onChange({
            ...docs,
            name: fieldKey,
            document: images,
          });
        }}
        multiple
      />
      {docs && (
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
          }}
        >
          <TextInput
            editable={false}
            value={
              docs?.expire instanceof Date
                ? docs.expire.toDateString()
                : "Không thời hạn"
            }
            style={{
              backgroundColor: colors.darkGray,
              padding: Layout.spacing.ml,
              marginTop: Layout.spacing.l,
              borderRadius: Layout.borderRadius.medium,
            }}
          />
        </TouchableOpacity>
      )}
      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(date) => {
          onChange({
            ...docs,
            expire: date,
          });
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />
    </View>
  );
}

type Documents = {
  name?: string;
  document: string[];
  status?: "pending";
  expire?: Date;
};

type AllDocuments = {
  [key: string]: Documents;
};

const documentFields = [
  "cmnd_cccd",
  "driving_license",
  "business_license",
  "registration_certificate",
  "civil_insurance",
  "car_inspection",
  "criminal_record",
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Layout.spacing.l,
  },
  header: {
    marginVertical: Layout.spacing.l,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: Layout.spacing.l,
    gap: Layout.spacing.xs,
  },
  nameRow: {
    flexDirection: "row",
    gap: Layout.spacing.l,
  },
  nameInput: {
    flex: 1,
  },
  backButton: {
    alignItems: "center",
    marginTop: Layout.spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Layout.spacing.xs,
    marginTop: Layout.spacing.l,
  },
  footerText: {
    fontSize: 14,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "600",
  },
  selectionList: {
    maxHeight: 300,
  },
  selectionItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eeeeee",
  },
  selectedItem: {
    backgroundColor: "#e6f3ff",
  },
  selectionItemText: {
    fontSize: 16,
    color: "#333333",
  },
});
