
"use client";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Header() {
  return (
    <div className="position-absolute top-0 start-0 m-3">
      <Image
        src="/profile.png"
        width={40}
        height={40}
        alt="Profile"
        className="rounded-circle border border-white"
      />
    </div>
  );
}

