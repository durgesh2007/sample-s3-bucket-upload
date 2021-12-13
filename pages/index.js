import Head from "next/head";
import { useState } from "react";
import aws from "aws-sdk";
import { UploadButton } from "./components/pitches/UploadButton";
import { DeckView } from "./components/pitches/DeckView";

export async function getStaticProps() {
  console.log(process.env.S3_UPLOAD_KEY);
  return { props: {} };
}

export default function Home() {
  const [isPDF, setIsPDF] = useState(true);
  const [fileData, setFileData] = useState();
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  //** Signed URL */
  const region = "";
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
        fileType = "pitch-abc-1.0.pdf";
      } else {
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
        setFileData(fileUrl);
        setIsPDF(true);
      } else {
        setFileData(fileUrl);
        setIsPDF(false);
      }
      setLoading(false);
    } else {
      alert("Please select file.");
    }
  };

  return (
    <div className="flex justify-center">
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col">
        {fileData && <DeckView isPDF={isPDF} file={fileData} />}
        <UploadButton
          handleFile={(event) => handleFile(event)}
          uploadPitch={uploadPitch}
          loading={loading}
        />
      </div>
    </div>
  );
}
