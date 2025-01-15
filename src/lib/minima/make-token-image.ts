export const makeTokenImage = (
  imageData: string,
  tokenid: string
): string | undefined => {
  let imageUrl: string | undefined = undefined;
  try {
    var parser = new DOMParser();
    const doc = parser.parseFromString(imageData, "application/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      console.error("Token does not contain an image", tokenid);
    } else {
      var imageString = doc.getElementsByTagName("artimage")[0].innerHTML;
      imageUrl = `data:image/jpeg;base64,${imageString}`;
    }

    return imageUrl;
  } catch (err) {
    console.error(`Failed to create image data ${tokenid}`, err);
  }

  return undefined;
};

export const fetchIPFSImageUri = async (image: string) => {
  try {
    const resp = await fetch(image);
    if (!resp.ok) {
      throw new Error("Failed to fetch image");
    }

    // Convert the response to a blob
    const blob = await resp.blob();

    // Create a data URL from the blob
    const dataUrl = URL.createObjectURL(blob);

    // Set the data URL as the image source
    return dataUrl;
  } catch (error) {
    console.error(error as string);
    return "";
  }
};
