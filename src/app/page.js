import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Background FX */}
      <div className="cyber-bg" />
      <div className="laser-line-left" />
      <div className="laser-line-right" />

      {/* Full-Width Hero Banner */}
      <section 
        style={{ 
          minHeight: "95vh", 
          width: "100%",
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          alignItems: "center", 
          textAlign: "center", 
          paddingTop: "120px", 
          paddingBottom: "60px",
          position: "relative",
          background: `linear-gradient(to bottom, rgba(7, 7, 9, 0.65) 0%, rgba(7, 7, 9, 0.8) 70%, rgba(7, 7, 9, 1) 100%), url('https://i.postimg.cc/rFnZRjp6/images.jpg') center/cover no-repeat`,
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.9)"
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "950px" }}>
          
          {/* Welcome Badge & HUD Warning */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div className="hud-warning animate-up">
              <span>⚠ WARNING***</span>
            </div>
            <div className="animate-up delay-1" style={{ background: "rgba(255, 0, 60, 0.25)", border: "1px solid var(--primary)", color: "#fff", padding: "6px 18px", borderRadius: "50px", fontSize: "0.9rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={15} color="var(--primary)" /> مرحباً بك في المدينة
            </div>
          </div>

          <h1 className="animate-up delay-1" style={{ fontSize: "clamp(2.2rem, 4.8vw, 4.2rem)", fontWeight: 900, lineHeight: 1.2, margin: "0 auto 1.2rem auto", textTransform: "uppercase", letterSpacing: "1px", textShadow: "0 4px 25px rgba(0,0,0,0.9)" }}>
            <span style={{ color: "var(--primary)", textShadow: "0 0 35px rgba(255,0,60,0.8)" }}>Black Horizon RP</span>
          </h1>

          <p className="animate-up delay-2" style={{ fontSize: "1.2rem", color: "#e4e4e7", maxWidth: "720px", margin: "0 auto 2.5rem auto", lineHeight: 1.7, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
            انضم إلى تجربة لعب أدوار استثنائية. عِش الحياة الإجرامية أو التحق بالشرطة والخدمات الطبية وابنِ نفوذك في مدينة حية ومتكاملة.
          </p>

          {/* High-Visibility Action Buttons */}
          <div className="animate-up delay-3" style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            <Link 
              href="/apply" 
              className="btn-cyber-primary"
              style={{
                fontSize: "1.2rem",
                padding: "16px 42px",
                boxShadow: "0 0 30px rgba(255, 0, 60, 0.8)",
                border: "2px solid #ff3366",
                borderRadius: "50px"
              }}
            >
              التقديم على السيرفر 🔥 <ArrowLeft size={18} />
            </Link>

            <Link 
              href="/rules" 
              className="btn-cyber-outline"
              style={{
                fontSize: "1.2rem",
                padding: "16px 42px",
                background: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "50px",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              قوانين المدينة 📖 <BookOpen size={18} />
            </Link>
          </div>

        </div>
      </section>

      {/* Why Choose Our Server? Section */}
      <section className="container" style={{ padding: "80px 1.5rem", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, textTransform: "uppercase" }}>
            لماذا يجب أن تختار <span style={{ color: "var(--primary)", borderBottom: "3px solid var(--primary)" }}>سيرفرنا؟</span>
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.8rem", fontSize: "1.1rem" }}>
            نوفر لك أقصى درجات الواقعية والأداء العالي لضمان ليلة لعب لا تُنسى
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          {/* Card #01 */}
          <div className="cyber-card">
            <div className="cyber-card-num">#01</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.8rem" }}>بيئة لعب عادلة وسلسة</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
              برمجة مخصصة وتطوير مستمر يضمن أعلى عدد إطارات (FPS) بدون أي تهنيج أو مشاكل تقنية أثناء المواجهات.
            </p>
          </div>

          {/* Card #02 */}
          <div className="cyber-card">
            <div className="cyber-card-num">#02</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.8rem" }}>اقتصاد وسيارات واقعية</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
              نظام اقتصادي مدروس وموزون، مع مئات السيارات الحصرية والوظائف الممتعة التي تجعل كل دقيقة لها قيمة.
            </p>
          </div>

          {/* Card #03 */}
          <div className="cyber-card">
            <div className="cyber-card-num">#03</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.8rem" }}>إدارة متواجدة 24/7</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
              فريق إداري محترف ومتواجد طوال اليوم لمساعدتك وحل المشكلات وضمان تطبيق القوانين بكل عدالة على الجميع.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (F.A.Q.) Section */}
      <section className="container" style={{ padding: "80px 1.5rem 120px 1.5rem", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900 }}>
            الأسئلة الشائعة <span style={{ color: "var(--primary)" }}>(F.A.Q)</span>
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>كل ما تحتاج معرفته قبل بدء رحلتك في المدينة</p>
        </div>

        <FAQAccordion />
      </section>

      {/* Join Discord CTA Banner */}
      <section className="container" style={{ paddingBottom: "100px" }}>
        <div 
          className="glass-panel" 
          style={{ 
            padding: "4rem 2rem", 
            textAlign: "center", 
            background: "linear-gradient(135deg, rgba(255,0,60,0.12) 0%, rgba(10,10,14,0.95) 100%)",
            border: "1px solid rgba(255,0,60,0.3)",
            boxShadow: "0 0 50px rgba(255,0,60,0.15)"
          }}
        >
          <h2 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "1rem" }}>
            جاهز للانضمام إلى مجتمعنا؟
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
            سجل دخولك الآن بحساب ديسكورد، قدم طلبك واستمتع ببيئة رول بلاي احترافية ومجتمع متفاعل!
          </p>
          <Link href="/apply" className="btn-cyber-primary" style={{ fontSize: "1.2rem", padding: "16px 48px" }}>
            قدم على السيرفر الآن 🔥
          </Link>
        </div>
      </section>
    </div>
  );
}

