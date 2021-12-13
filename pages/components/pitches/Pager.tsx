import { useState } from "react";

interface PagerProps {
    pageNumber: number;
    numPages: number;
    onPageChange: (value) => any;
}

export const Pager = ({ pageNumber, numPages, onPageChange }: PagerProps) => {

    return (
        <div className="flex flex-row py-2 justify-center justify-items-center place-content-between">
            <button
                className={
                    pageNumber === 1
                        ? "bg-blue-100 px-2 mr-5"
                        : "bg-blue-300 px-2 mr-5"
                }
                onClick={() => onPageChange(-1)}
                disabled={pageNumber === 1}
            >
                PRE
            </button>
            <p>
                Page {pageNumber} of {numPages}
            </p>
            <button
                className={
                    pageNumber === pageNumber
                        ? "bg-blue-300 px-2 ml-5"
                        : "bg-blue-100 px-2 ml-5"
                }
                onClick={() => onPageChange(+1)}
                disabled={numPages == pageNumber}
            >
                NEXT
            </button>
        </div>
    )
}