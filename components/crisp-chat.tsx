"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("52095854-dd65-41e6-84bb-b0a9bd204b49");
  }, []);

  return null;
};
