"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type FireMapLinkProps = Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  "href"
> & {
  pathname: "/fires" | "/fires/select";
};

export function FireMapLink({ pathname, ...rest }: FireMapLinkProps) {
  const sp = useSearchParams();
  const qs = sp.toString();
  const href = qs.length > 0 ? `${pathname}?${qs}` : pathname;
  return <Link href={href} {...rest} />;
}
