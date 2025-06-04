"use client";

import { forwardRef, ReactNode } from "react";
import * as Separator from "@radix-ui/react-separator";

type MainCardProps = {
  border?: boolean;
  boxShadow?: boolean;
  children?: ReactNode;
  subheader?: string;
  content?: boolean;
  darkTitle?: boolean;
  divider?: boolean;
  elevation?: number;
  secondary?: ReactNode;
  shadow?: string;
  title?: string | ReactNode;
  codeHighlight?: boolean;
  codeString?: string;
  modal?: boolean;
  className?: string;
  contentClassName?: string;
  [key: string]: any;
};

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      border = true,
      boxShadow,
      children,
      subheader,
      content = true,
      darkTitle,
      divider = true,
      secondary,
      shadow,
      title,
      modal = false,
      className = "",
      contentClassName = "",
      ...others
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          relative
          ${border ? "border border-gray-700" : "border-none"}
          rounded-md
          ${boxShadow && !border ? shadow || "shadow-sm" : ""}
          ${
            modal
              ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-50px)] sm:w-auto max-w-3xl"
              : ""
          }
          hover:${boxShadow ? shadow || "shadow-sm" : ""}
          ${className}
        `}
        {...others}
      >
        {title && !darkTitle && (
          <>
            <div className="p-2.5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{title}</h3>
                {subheader && (
                  <p className="text-sm text-gray-500">{subheader}</p>
                )}
              </div>
              {secondary && <div className="ml-auto">{secondary}</div>}
            </div>
            {divider && <Separator.Root className="h-px bg-gray-700 w-full" />}
          </>
        )}

        {content ? (
          <div className={`p-4 ${contentClassName}`}>{children}</div>
        ) : (
          children
        )}
      </div>
    );
  }
);

MainCard.displayName = "MainCard";

export default MainCard;
