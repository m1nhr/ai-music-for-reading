import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateMusic(prompt) {
  try {
    // Create a prediction and wait for it to complete
    const prediction = await replicate.predictions.create({
      version: "671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
      input: {
        prompt: prompt,
        model_version: "stereo-melody-large",
        duration: 30,
        temperature: 1,
        top_k: 250,
        top_p: 0,
        classifier_free_guidance: 3,
      }
    });

    console.log('Prediction created:', prediction.id);

    // Wait for the prediction to complete
    let completedPrediction = prediction;
    while (completedPrediction.status !== 'succeeded' && completedPrediction.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      completedPrediction = await replicate.predictions.get(prediction.id);
      console.log('Prediction status:', completedPrediction.status);
    }

    if (completedPrediction.status === 'failed') {
      throw new Error('Music generation failed: ' + completedPrediction.error);
    }

    console.log('Prediction completed:', completedPrediction.output);

    // Extract the audio URL from the output
    const audioUrl = completedPrediction.output;

    if (!audioUrl || typeof audioUrl !== 'string') {
      console.error('Invalid output format:', completedPrediction.output);
      throw new Error('Invalid audio URL format from Replicate');
    }

    console.log('Audio URL:', audioUrl);
    return audioUrl;

  } catch (error) {
    console.error('Error generating music:', error);
    throw error;
  }
}
