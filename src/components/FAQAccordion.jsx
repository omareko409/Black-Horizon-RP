"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "كيف يمكنني التقديم للانضمام إلى السيرفر؟",
    answer: "يمكنك الضغط على زر 'قدم الآن' في أعلى الصفحة، وتسجيل الدخول بحساب ديسكورد الخاص بك، ثم ملء نموذج التقديم وانتظار مراجعة الإدارة."
  },
  {
    question: "ما هي شروط التقديم في السيرفر؟",
    answer: "يجب أن تكون قادراً على الالتزام بقوانين الرول بلاي (Roleplay)، وأن يتجاوز عمرك السن الأدنى المحدد، وتملك ميكروفون بصوت واضح وخالي من التشويش."
  },
  {
    question: "كم يستغرق مراجعة طلب التقديم؟",
    answer: "تستغرق مراجعة الطلبات عادةً من 12 إلى 24 ساعة كحد أقصى من قبل فريق الإدارة المختص."
  },
  {
    question: "أين أجد القوانين الخاصة بالمدينة؟",
    answer: "يمكنك تصفح جميع قوانين السيرفر وقوانين الجرائم والشرطة مباشرةً عبر قسم 'القوانين' في الشريط العلوي للموقع."
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className="cyber-card"
            style={{ padding: "1.5rem 2rem", cursor: "pointer" }}
            onClick={() => toggleFAQ(index)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: isOpen ? "var(--primary)" : "#fff", transition: "color 0.3s ease" }}>
                {faq.question}
              </h3>
              <ChevronDown 
                size={22} 
                style={{ 
                  color: "var(--primary)", 
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", 
                  transition: "transform 0.3s ease" 
                }} 
              />
            </div>
            
            {isOpen && (
              <p style={{ marginTop: "1rem", color: "var(--text-muted)", lineHeight: "1.7", fontSize: "1rem", borderTop: "1px solid rgba(255,0,60,0.1)", paddingTop: "1rem" }}>
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
