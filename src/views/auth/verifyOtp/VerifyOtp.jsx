// project-imoports
import AuthVerifyOtpForm from 'sections/auth/AuthVerifyOtp';

// ===========================|| AUTH - LOGIN V1 ||=========================== //

export default function ForgotPasswordPage() {
  return (
    <div className="auth-main">
      <div className="auth-wrapper v1">
        <div className="auth-form">
          <div className="position-relative">
            <div className="auth-bg">
              <span className="r"></span>
              <span className="r s"></span>
              <span className="r s"></span>
              <span className="r"></span>
            </div>
            <AuthVerifyOtpForm link="/register" />
          </div>
        </div>
      </div>
    </div>
  );
}
