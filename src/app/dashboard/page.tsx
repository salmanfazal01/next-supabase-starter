import { redirect } from "next/navigation";

const page = () => {
  return redirect("/dashboard/profile");
};

export default page;
