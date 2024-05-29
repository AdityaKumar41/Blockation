import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadFiles } from "../../actions/fileAction";
import Hero from "../layout/Hero";
import { create } from "@web3-storage/w3up-client";

function UploadFiles() {
  const [upload, setUpload] = useState("");
  const [fileName, setFilename] = useState("");
  const [yes, setYes] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formSubmit = async (e) => {
    e.preventDefault();
    console.log(upload);
    const client = await create();
    const account = await client.login(`chaitutatipamula023@gmail.com`);
    const space = await client.createSpace("Blocation");
    await client.addSpace(await space.createAuthorization(client));
    await account.provision(space.did());
    const currentSpace = await client.setCurrentSpace(
      `did:key:z6Mks5PaV1V73nqw7D87BbbmJ3XVkeL1kWiFt3BSaNMkdxiM`
    );
    const recovery = await space.createRecovery(account.did());
    await client.capability.access.delegate({
      space: space.did(),
      delegations: [recovery],
    });
    await client.addSpace(await space.createAuthorization(client));
    const uploadingFile = new File([upload], fileName);
    console.log(uploadingFile);
    const filecid = await client.uploadDirectory([uploadingFile]);
    console.log(filecid.toString());
    dispatch(
      uploadFiles({ file: upload, cid: filecid.toString(), isCert: yes })
    );
  };
  const formDataChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        console.log(reader.result);
        console.log(file);
        const fileData = new Blob([reader.result]);
        const fileObject = new File([fileData], file.name);
        setFilename(file.name);
        setUpload(fileObject);
      }
    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <>
      <Hero text="Upload Your Files Here" />

      <div class="container">
        <div class="max-w-4xl flex items-center justify-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-20">
          <div
            id="profile"
            class="w-auto rounded-lg shadow-2xl bg-white opacity-80 mx-6 lg:mx-0"
          >
            <div class="p-2 md:p-8 text-center lg:text-left">
              <div class="flex justify-start  rounded-full lg:mb-4 shadow-xl mx-auto lg:mx-1 -mt-20 h-48 w-48 bg-cover bg-center">
                <img className="rounded-full" src="/10.jpg" alt="" />
              </div>

              <div class="p-2 md:p-8 text-center lg:text-left">
                <div class="flex justify-center ">
                  <div class="py-4 pr-5">
                    <form
                      action="https://jellyfish-app-4v9we.ondigitalocean.app/file/sendfile"
                      method="post"
                      onSubmit={formSubmit}
                      encType="multipart/form-data"
                    >
                      <label>Is this a Certificate</label>
                      <input
                        type="checkbox"
                        className="form-control"
                        name="upload"
                        multiple
                        onChange={() => {
                          setYes(!yes);
                        }}
                      />
                      <br />
                      <input
                        type="file"
                        className="form-control"
                        name="upload"
                        multiple
                        onChange={formDataChange}
                      />
                      <input
                        className="bg-green-700 h-10 w-28 text-white rounded-lg hover:bg-green-600"
                        type="submit"
                        value="Upload"
                      />
                    </form>
                  </div>
                </div>
                <p class="text-sm">
                  Need help,feel free to &nbsp;
                  <a href="#" class="font-bold underline hover:text-green-700">
                    contact us
                  </a>{" "}
                  &nbsp; or just use the below links
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadFiles;
