import SpinnerWithText from "@/components/common/SpinnerWithText";

export default function Loading() {
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
      <SpinnerWithText text="Loading artifacts..." />
    </div>
  );
}
