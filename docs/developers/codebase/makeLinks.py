import os
import shutil


def main():
    apps_dir = os.path.join(os.getcwd(), "../../../apps")
    libs_dir = os.path.join(os.getcwd(), "../../../libs")

    shutil.rmtree(os.path.join(os.getcwd(), "apps"), ignore_errors=True)
    shutil.rmtree(os.path.join(os.getcwd(), "libs"), ignore_errors=True)

    os.mkdir(os.path.join(os.getcwd(), "apps"))
    os.mkdir(os.path.join(os.getcwd(), "libs"))
    for path, dirs, files in os.walk(apps_dir):
        for file in files:
            if file.endswith(".md"):
                relative_path = os.path.relpath(path, apps_dir)
                if("src" in relative_path):
                    relative_path = relative_path.replace("src", "")

                os.makedirs(os.path.join(os.getcwd(), "apps", relative_path), exist_ok=True)
                os.link(os.path.join(path, file), os.path.join(os.getcwd(), "apps", relative_path, file))
    for path, dirs, files in os.walk(libs_dir):
        for file in files:
            if file.endswith(".md"):
                relative_path = os.path.relpath(path, libs_dir)
                if("src" in relative_path):
                    relative_path = relative_path.replace("src", "")
                os.makedirs(os.path.join(os.getcwd(), "libs", relative_path), exist_ok=True)
                os.link(os.path.join(path, file), os.path.join(os.getcwd(), "libs", relative_path, file))


if __name__ == "__main__":
    main()
