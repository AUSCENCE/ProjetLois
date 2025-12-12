import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Projet de lois | Connexio"
        description="Connexion"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
