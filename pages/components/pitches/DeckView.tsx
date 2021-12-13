import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import { Pager } from "./Pager";

interface PicthDeckViewProps {
    isPDF: boolean;
    file: string;
}

export const DeckView = ({ isPDF, file }: PicthDeckViewProps) => {

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function onPageChange(value: number) {
        let no = pageNumber + value;
        setPageNumber(no);
    };

    return (
        <div>
            {isPDF ? (
                <div className="">
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page
                            pageNumber={pageNumber}
                            height={50}
                            width={250}
                        />
                    </Document>
                    <Pager numPages={numPages} pageNumber={pageNumber} onPageChange={(value) => onPageChange(value)} />
                </div>
            ) : (
                <video width="250" height="50" controls>
                    <source src={file} type="video/mp4" />
                </video>
            )}
        </div>
    )
}