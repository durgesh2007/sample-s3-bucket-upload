import { useState } from "react";

export interface UploadButtonProps  {//extends {chakraui}
    handleFile: (event) => any;
    uploadPitch: () => any;
    loading: boolean;
}

export const UploadButton = ({ handleFile, uploadPitch, loading }: UploadButtonProps) => {

    return (
        <div>
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
            {loading && <p>Loading...!</p>}
        </div>
    )
}