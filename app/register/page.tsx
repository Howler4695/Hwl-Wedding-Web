import QRCode from "react-qr-code";

export default function Register() {
  return (
    <div className="flex flex-col justify-self-center gap-6 rounded-2xl bg-white p-8 max-w-3xl">
      <div>You've been invited to Hannah and Hayden Wedding</div>
      <div>4 September 2026</div>
      <div className="flex justify-space-evenly">
        <button>Sorry I can't make it</button>
        <button>Yes I can make it</button>
      </div>
      {/* <div>
        <QRCode value="test" />
      </div> */}
    </div>
  );
}
