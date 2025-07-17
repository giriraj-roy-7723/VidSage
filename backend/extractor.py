import os
from moviepy.editor import VideoFileClip
import whisper

def extract_audio_from_video(video_path: str, audio_path: str) -> None:
    """
    Extracts audio from the video and saves it as a WAV file.
    """
    os.makedirs(os.path.dirname(audio_path), exist_ok=True)
    print(f"[INFO] Extracting audio from {video_path}...")
    clip = VideoFileClip(video_path)
    clip.audio.write_audiofile(audio_path)
    print(f"[INFO] Audio saved to {audio_path}")


def transcribe_audio(audio_path: str, output_text_path: str) -> str:
    """
    Transcribes the audio using open-source Whisper and saves the text.
    """
    print(f"[INFO] Loading Whisper model...")
    model = whisper.load_model("base")  #or "tiny" for faster, "small"/"medium"/"large" for better accuracy

    print(f"[INFO] Transcribing audio from {audio_path}...")
    result = model.transcribe(audio_path)

    text = result["text"]

    with open(output_text_path, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"[INFO] Transcription saved to {output_text_path}")
    return text


def extract_and_transcribe(video_path: str, working_dir: str = "data/video_data") -> dict:
    """
    Combines audio extraction and transcription into one step.
    Returns the transcription and output paths.
    """
    base_name = os.path.splitext(os.path.basename(video_path))[0]
    audio_path = os.path.join(working_dir, f"{base_name}.wav")
    output_text_path = os.path.join(working_dir, f"{base_name}_transcript.txt")

    extract_audio_from_video(video_path, audio_path)
    transcript = transcribe_audio(audio_path, output_text_path)
    os.remove(audio_path)

    return {
        "status": "success",
        "transcript_path": output_text_path,
        "transcript": transcript
    }
