export async function publishToFacebook(pageId: string, accessToken: string, message: string, imageUrl?: string) {
  try {
    let url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    const params = new URLSearchParams({
      message,
      access_token: accessToken,
    });

    if (imageUrl) {
      url = `https://graph.facebook.com/v19.0/${pageId}/photos`;
      params.append('url', imageUrl);
    }

    const res = await fetch(`${url}?${params.toString()}`, { method: 'POST' });
    const data = await res.json();

    if (data.error) {
      throw new Error(`Facebook API Error: ${data.error.message}`);
    }

    return { success: true, id: data.id || data.post_id };
  } catch (err: any) {
    console.error('publishToFacebook Error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function publishToInstagram(igUserId: string, accessToken: string, caption: string, imageUrl: string) {
  try {
    // Step 1: Create media container
    const createRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${accessToken}`,
      { method: 'POST' }
    );
    const createData = await createRes.json();

    if (createData.error) {
      throw new Error(`IG Create Media Error: ${createData.error.message}`);
    }

    const creationId = createData.id;
    if (!creationId) {
      throw new Error('Failed to get creation_id from Instagram');
    }

    // Step 2: Publish media container
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
      { method: 'POST' }
    );
    const publishData = await publishRes.json();

    if (publishData.error) {
      throw new Error(`IG Publish Media Error: ${publishData.error.message}`);
    }

    return { success: true, id: publishData.id };
  } catch (err: any) {
    console.error('publishToInstagram Error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}
