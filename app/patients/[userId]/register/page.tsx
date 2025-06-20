import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";

type SearchParamProps = {
  params: {
    userId: string;
  };
};

const Register = async (props: SearchParamProps) => {
  const { params } = props;
  const { userId } = await params;

  // Fetch the user data
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="container remove-scrollbar">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="h-10 mb-12 w-fit"
          />

          <RegisterForm user={user} />

          <p className="py-12 copyright">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
