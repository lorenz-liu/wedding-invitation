import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Input,
  Textarea,
  Button,
  ScrollView,
  Image,
} from "@tarojs/components";
import { AnimatedView } from "../../../components/AnimatedView";
import Taro from "@tarojs/taro";
import { FORM_SUBMITTED_KEY } from "../../../constants/config";
import { submitGuestForm } from "../../../utils/submitGuestForm";
import { images } from "../../../utils/assets";
import "./PageForm.scss";

interface Guest {
  name: string;
  relation: string;
}

interface FormData {
  mainContact: string;
  phone: string;
  wechatId: string;
  guests: Guest[];
  isDriving: boolean;
  needsShuttle: boolean;
  shuttleLocation: string;
  notes: string;
}

const EMPTY_FORM_DATA: FormData = {
  mainContact: "",
  phone: "",
  wechatId: "",
  guests: [{ name: "", relation: "" }],
  isDriving: false,
  needsShuttle: false,
  shuttleLocation: "",
  notes: "",
};

interface PageFormProps {
  isActive: boolean;
  onScrollTopChange?: (scrollTop: number) => void;
}

interface CreditFooterProps {
  signatureReveal: boolean;
}

function CreditFooter({ signatureReveal }: CreditFooterProps) {
  const wrapClass = signatureReveal
    ? "credits-signature-wrap credits-signature-wrap--reveal"
    : "credits-signature-wrap";

  return (
    <View>
      <View className="form-footer">
        <Text className="footer-text">感谢您的回复，期待与您相见</Text>
        <Text className="footer-names">刘兆薰 & 高文珩 敬邀</Text>
      </View>

      <View className="form-credits-wrap">
        <View className="form-credits">
          <View className="credits-line-wrap">
            <Text className="credits-line">平面与交互设计 by 新娘 高文珩</Text>
            <View className={wrapClass} style={{ animationDelay: "0ms" }}>
              <Image
                className="credits-signature"
                src={images.signatureGao}
                mode="heightFix"
              />
            </View>
          </View>
          <Text className="credits-line credits-en">
            Graphic & Interactive Design by Wenheng Gao, the Bride
          </Text>
          <View className="credits-line-wrap">
            <Text className="credits-line">代码开发与维护 by 新郎 刘兆薰</Text>
            <View className={wrapClass} style={{ animationDelay: "280ms" }}>
              <Image
                className="credits-signature"
                src={images.signatureNiu}
                mode="heightFix"
              />
            </View>
          </View>
          <Text className="credits-line credits-en">
            Engineered & Maintained by Zhaoxun Liu, the Groom
          </Text>
        </View>
      </View>
    </View>
  );
}

export const PageForm: React.FC<PageFormProps> = ({
  isActive,
  onScrollTopChange,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [signatureReveal, setSignatureReveal] = useState(false);
  const signatureRevealStartedRef = useRef(false);

  useEffect(() => {
    const alreadySubmitted = Taro.getStorageSync(FORM_SUBMITTED_KEY);
    if (alreadySubmitted) {
      setSubmitted(true);
    }
  }, []);

  useEffect(() => {
    onScrollTopChange?.(0);
  }, [submitted, onScrollTopChange]);

  useEffect(() => {
    if (!isActive) {
      signatureRevealStartedRef.current = false;
      setSignatureReveal(false);
      return;
    }
    if (signatureRevealStartedRef.current) return;
    signatureRevealStartedRef.current = true;
    setSignatureReveal(true);
  }, [isActive]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDrivingToggle = () => {
    setFormData((prev) => {
      if (prev.isDriving) {
        return { ...prev, isDriving: false };
      }
      return {
        ...prev,
        isDriving: true,
        needsShuttle: false,
        shuttleLocation: "",
      };
    });
  };

  const handleShuttleToggle = () => {
    setFormData((prev) => {
      if (prev.needsShuttle) {
        return { ...prev, needsShuttle: false, shuttleLocation: "" };
      }
      return { ...prev, needsShuttle: true, isDriving: false };
    });
  };

  const handleRefillForm = () => {
    Taro.removeStorageSync(FORM_SUBMITTED_KEY);
    setFormData(EMPTY_FORM_DATA);
    setSubmitted(false);
  };

  const handleGuestChange = (
    index: number,
    field: keyof Guest,
    value: string,
  ) => {
    const newGuests = [...formData.guests];
    newGuests[index] = { ...newGuests[index], [field]: value };
    setFormData((prev) => ({ ...prev, guests: newGuests }));
  };

  const addGuest = () => {
    setFormData((prev) => ({
      ...prev,
      guests: [...prev.guests, { name: "", relation: "" }],
    }));
  };

  const removeGuest = (index: number) => {
    const newGuests = formData.guests.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, guests: newGuests }));
  };

  const handleSubmit = async () => {
    if (!formData.mainContact.trim()) {
      Taro.showToast({ title: "请填写姓名", icon: "none" });
      return;
    }

    Taro.showLoading({ title: "提交中..." });

    try {
      const result = await submitGuestForm(formData);

      if (result.success) {
        Taro.setStorageSync(FORM_SUBMITTED_KEY, true);
        setSubmitted(true);
      } else {
        throw new Error(result.error || result.message || "提交失败");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      Taro.showToast({
        title: error.message || "网络错误，请重试",
        icon: "none",
        duration: 3000,
      });
    } finally {
      Taro.hideLoading();
    }
  };

  const handleScroll = (e: { detail: { scrollTop: number } }) => {
    onScrollTopChange?.(e.detail.scrollTop);
  };

  if (submitted) {
    return (
      <View className="page page-form page-form-thanks">
        <View className="paper-container thanks-container">
          <AnimatedView
            animation="fadeInScale"
            isActive={isActive}
            duration={800}
          >
            <View className="thanks-header">
              <Text className="thanks-title">感谢您的回复</Text>
            </View>
          </AnimatedView>

          <AnimatedView
            animation="fadeInUp"
            isActive={isActive}
            delay={300}
            duration={600}
          >
            <View className="thanks-body">
              <Text className="thanks-message">我们已收到您的回函。</Text>
              <Text className="thanks-detail">
                2026年7月25日 · 成都
                {"\n"}
                期待与您相见
              </Text>
            </View>
          </AnimatedView>

          <AnimatedView
            animation="fadeIn"
            isActive={isActive}
            delay={600}
            duration={600}
          >
            <View className="thanks-actions">
              <Button className="refill-btn" onClick={handleRefillForm}>
                重新填写
              </Button>
            </View>
          </AnimatedView>
          <CreditFooter signatureReveal={signatureReveal} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className="page page-form"
      scrollY
      showScrollbar={false}
      onScroll={handleScroll}
    >
      <View className="form-scroll-inner">
      <View className="paper-container">
        {/* Paper Header */}
        <AnimatedView animation="fadeInUp" isActive={isActive} duration={800}>
          <View className="paper-header">
            <View className="header-content">
              <Text className="form-title">回函</Text>
              <Text className="form-subtitle">诚挚期待您的出席</Text>
            </View>
          </View>
        </AnimatedView>

        {/* Main Contact Section */}
        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={200}
          duration={600}
        >
          <View className="form-section contact-section">
            <View className="section-header">
              <View className="section-number">01</View>
              <Text className="section-title">联系人信息</Text>
            </View>
            <View className="input-group">
              <View className="form-field required">
                <Text className="field-label">姓名</Text>
                <Input
                  className="field-input"
                  value={formData.mainContact}
                  onInput={(e) =>
                    handleInputChange("mainContact", e.detail.value)
                  }
                  placeholder="请输入您的姓名"
                />
                <View className="field-underline" />
              </View>
              <View className="form-field">
                <Text className="field-label">手机号码</Text>
                <Input
                  className="field-input"
                  type="number"
                  value={formData.phone}
                  onInput={(e) => handleInputChange("phone", e.detail.value)}
                  placeholder="选填，便于我们与您联系"
                />
                <View className="field-underline" />
              </View>
              <View className="form-field">
                <Text className="field-label">微信号</Text>
                <Input
                  className="field-input"
                  value={formData.wechatId}
                  onInput={(e) => handleInputChange("wechatId", e.detail.value)}
                  placeholder="选填，便于我们与您联系"
                />
                <View className="field-underline" />
              </View>
            </View>
          </View>
        </AnimatedView>

        {/* Guests Section */}
        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={350}
          duration={600}
        >
          <View className="form-section guests-section">
            <View className="section-header">
              <View className="section-number">02</View>
              <Text className="section-title">同行宾客</Text>
            </View>
            <View className="guests-list">
              {formData.guests.map((guest, index) => (
                <View key={index} className="guest-card">
                  <View className="guest-number">{index + 1}</View>
                  <View className="guest-inputs">
                    <Input
                      className="guest-input-name"
                      value={guest.name}
                      onInput={(e) =>
                        handleGuestChange(index, "name", e.detail.value)
                      }
                      placeholder="姓名"
                    />
                    <View className="input-divider" />
                    <Input
                      className="guest-input-relation"
                      value={guest.relation}
                      onInput={(e) =>
                        handleGuestChange(index, "relation", e.detail.value)
                      }
                      placeholder="TA是您的..."
                    />
                  </View>
                  {formData.guests.length > 1 && (
                    <View
                      className="remove-guest-btn"
                      onClick={() => removeGuest(index)}
                    >
                      <Text className="remove-icon">×</Text>
                    </View>
                  )}
                </View>
              ))}
              <Button className="add-guest-btn" onClick={addGuest}>
                <Text className="add-icon">+</Text>
                <Text className="add-text">添加同行人员</Text>
              </Button>
            </View>
          </View>
        </AnimatedView>

        {/* Transport Section */}
        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={500}
          duration={600}
        >
          <View className="form-section transport-section">
            <View className="section-header">
              <View className="section-number">03</View>
              <Text className="section-title">出行方式</Text>
            </View>
            <View className="transport-options">
              <View
                className={`transport-card ${formData.isDriving ? "selected" : ""}`}
                onClick={handleDrivingToggle}
              >
                <View className="transport-icon">🚗</View>
                <Text className="transport-label">自行前往</Text>
                <View
                  className={`selection-ring ${formData.isDriving ? "active" : ""}`}
                >
                  {formData.isDriving && <View className="selection-dot" />}
                </View>
              </View>
              <View
                className={`transport-card ${formData.needsShuttle ? "selected" : ""}`}
                onClick={handleShuttleToggle}
              >
                <View className="transport-icon">🚌</View>
                <Text className="transport-label">需要接驳</Text>
                <View
                  className={`selection-ring ${formData.needsShuttle ? "active" : ""}`}
                >
                  {formData.needsShuttle && <View className="selection-dot" />}
                </View>
              </View>
            </View>

            {formData.needsShuttle && (
              <AnimatedView animation="fadeIn" isActive={true} duration={300}>
                <View className="shuttle-details">
                  <Text className="shuttle-label">请填写希望接驳的地点：</Text>
                  <Input
                    className="shuttle-input"
                    value={formData.shuttleLocation}
                    onInput={(e) =>
                      handleInputChange("shuttleLocation", e.detail.value)
                    }
                    placeholder="例如：成都东站、双流机场等"
                  />
                </View>
              </AnimatedView>
            )}
          </View>
        </AnimatedView>

        {/* Notes Section */}
        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={650}
          duration={600}
        >
          <View className="form-section notes-section">
            <View className="section-header">
              <View className="section-number">04</View>
              <Text className="section-title">留言</Text>
            </View>
            <View className="text-area-wrapper">
              <Textarea
                className="text-area"
                value={formData.notes}
                onInput={(e) => handleInputChange("notes", e.detail.value)}
                placeholder="在此处留下您想送上的祝福，或是需要我们特别留意的事项，例如饮食过敏等。"
                placeholderStyle="color: #c9a87c"
                placeholderClass="notes-textarea-placeholder"
              />
              <View className="paper-lines">
                <View className="paper-line" />
                <View className="paper-line" />
                <View className="paper-line" />
                <View className="paper-line" />
              </View>
            </View>
          </View>
        </AnimatedView>

        {/* Submit Section */}
        <AnimatedView
          animation="fadeInUp"
          isActive={isActive}
          delay={800}
          duration={600}
        >
          <View className="submit-section">
            <Button className="submit-btn" onClick={handleSubmit}>
              <Text className="btn-text">确认提交</Text>
            </Button>
          </View>
        </AnimatedView>
        <CreditFooter signatureReveal={signatureReveal} />
      </View>
      </View>
    </ScrollView>
  );
};
