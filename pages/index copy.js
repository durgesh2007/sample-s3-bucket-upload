import Head from "next/head";
import { useState } from "react";
import { useS3Upload } from "next-s3-upload";
import { pdfjs, Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import aws from "aws-sdk";

export async function getStaticProps() {
  console.log(process.env.S3_UPLOAD_KEY);
  return { props: {} };
}

export default function Home() {
  let [PDF, setPDF] = useState();
  let [video, setVideo] = useState();
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  let handleFileChange = async (file) => {
    try {
      setLoading(true);
      console.log(file);
      let { url } = await uploadToS3(file);
      console.log(url);
      if (file.type === "application/pdf") {
        setPDF(url);
        setVideo(null);
      } else {
        setVideo(url);
        setPDF(null);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  let onPageChange = async (value) => {
    let no = pageNumber + value;
    setPageNumber(no);
  };

  //** Signed URL */
  const [file, setFile] = useState();
  const region = ""
  const bucketName = "";
  const accessKeyId = "";
  const secretAccessKey = "";

  const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4",
  });

  const generateUploadURL = async (fileType) => {
    const fileName = `pitch-12347/${fileType}`;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 60,
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    console.log("genebrated Url:", uploadURL);
    return uploadURL;
  };

  const handleFile = (e) => {
    console.log(e);
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const uploadPitch = async () => {
    if (file) {
      let fileType = "";
      setLoading(true);
      console.log(file.type);
      if (file.type === "application/pdf") {
        // setPDF(url);
        setVideo(null);
        fileType = "pitch-abc-1.0.pdf";
      } else {
        // setVideo(url);
        setPDF(null);
        fileType = "pitch-abc-1.0.mov";
      }

      const url = await generateUploadURL(fileType);
      console.log("url", url);
      // post the file direclty to the s3 bucket
      const resp = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: file,
      });
      console.log(resp);
      console.log(url);
      const fileUrl = url.split("?")[0];
      console.log(fileUrl);
      if (file.type === "application/pdf") {
        setPDF(fileUrl);
        setVideo(null);
      } else {
        setVideo(fileUrl);
        setPDF(null);
      }
      setLoading(false);
    } else {
      alert("Please select file.");
    }
  };

  return (
    <div className="flex justify-center">
      <Head>
        <title>Demo</title>
      </Head>
      <div className="flex flex-col justify-center">
        {PDF && (
          <div className="flex justify-center py-5">
            <a
              href={PDF}
              download={PDF}
              target="_blank"
              className="bg-blue-300 p-2"
            >
              Download
            </a>
          </div>
        )}
        {video && (
          <div className="py-5">
            <a
              href={video}
              download={video}
              target="_blank"
              className="bg-blue-300 p-2"
            >
              Download
            </a>
          </div>
        )}
        {PDF && (
          <div className="">
            <Document file={PDF} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                height={50}
                width={250}
                className="border-1"
              />
            </Document>
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
          </div>
        )}
        {video && (
          <video width="250" height="50" controls>
            <source src={video} type="video/mp4" />
          </video>
        )}
        <p>{loading && "Uploading..."}</p>
        {/* <FileInput onChange={handleFileChange} />
        <button className="bg-blue-300 p-2 mt-5 mb-1" onClick={openFileDialog}>
          Upload Pitch
        </button>
        <p className="text-sm">Only supported the pdf and Video file formats</p> */}
        <input
          type="file"
          accept="application/pdf, video/*"
          onChange={(event) => handleFile(event)}
          className="mt-5"
        />
        <p className="text-sm">PDF and Video file formats only</p>
        <button className="bg-blue-300 p-2 mt-5 mb-1" onClick={uploadPitch}>
          Upload Pitch
        </button>
      </div>
    </div>
  );
}
