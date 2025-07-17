import os
from yt_dlp import YoutubeDL

def download_video(url: str, output_dir: str =r"backend\data\video_data") -> dict:
    print(f"creating directory: {output_dir}")
    os.makedirs(output_dir, exist_ok=True)

    output_template = os.path.join(output_dir, "input_vid.%(ext)s")
    print(f"output template: {output_template}")

    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'outtmpl': output_template,
        'quiet': False,               
        'merge_output_format': 'mp4',
        'overwrites': True
    }

    try:
        with YoutubeDL(ydl_opts) as ydl:
            print(f"starting download for URL: {url}")
            info = ydl.extract_info(url, download=True)
            print("download complete.")
            print(f"title: {info.get('title')}")
            print(f"uploader: {info.get('uploader')}")

            ext = info.get("ext", "mp4")
            downloaded_file = os.path.join(output_dir, f"input_vid.{ext}")
            final_path = os.path.join(output_dir, "input_vid.mp4")
            return {
                "status": "success" if os.path.exists(final_path) else "error",
                "filepath": final_path,
                "title": info.get("title", ""),
                "author": info.get("uploader", ""),
                "views": info.get("view_count", 0),
            }

    except Exception as e:
        print(f"exception occurred: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }
