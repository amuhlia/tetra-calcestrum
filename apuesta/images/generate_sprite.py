#!/usr/bin/env python3
"""
Script to generate a horse sprite sheet from a base caballo.png image.
Creates 8 frames with slight variations for walking/galloping animation.
"""

from PIL import Image, ImageDraw
import os

def create_horse_sprite_sheet():
    # Paths
    base_image_path = "./caballo.png"
    sprite_sheet_path = "./caballo-sprite.png"

    # Check if base image exists
    if not os.path.exists(base_image_path):
        print(f"Error: Base image '{base_image_path}' not found!")
        return False

    # Load the base image
    try:
        base_image = Image.open(base_image_path).convert("RGBA")
        print(f"Loaded base image: {base_image.size[0]}x{base_image.size[1]}")
    except Exception as e:
        print(f"Error loading base image: {e}")
        return False

    # Get dimensions
    width, height = base_image.size

    # Configuration for sprite sheet
    frame_count = 8
    frame_width = width
    frame_height = height

    # Create new image for sprite strip
    sprite_sheet = Image.new("RGBA", (frame_width * frame_count, frame_height), (0, 0, 0, 0))

    print(f"Creating sprite sheet with {frame_count} frames...")
    print(f"Each frame: {frame_width}x{frame_height}")
    print(f"Total size: {frame_width * frame_count}x{frame_height}")

    # Create frames with slight variations for animation
    for i in range(frame_count):
        # Start with a copy of the base image
        frame = base_image.copy()

        # Apply transformations based on frame number to create walking motion
        # This creates a simple up/down bobbing motion for walking

        # Calculate vertical offset (sinusoidal motion for walking)
        import math
        # Create a walking cycle: down, up, down, up...
        # Using sine wave for smooth motion
        cycle_position = (i / frame_count) * 2 * 3.14159  # 0 to 2π
        vertical_offset = int(5 * math.sin(cycle_position))  # ±5 pixels

        # Optional: Add slight horizontal offset for stride
        horizontal_offset = int(2 * math.sin(cycle_position + 3.14159/2))  # ±2 pixels, out of phase

        # Create a new frame with the offset
        if vertical_offset != 0 or horizontal_offset != 0:
            # Create offset frame
            offset_frame = Image.new("RGBA", (width, height), (0, 0, 0, 0))

            # Calculate position with wrap-around for negative offsets
            x_offset = max(0, horizontal_offset)  # Only positive offset for simplicity
            y_offset = max(0, vertical_offset)    # Only positive offset for simplicity

            # Paste the original image with offset
            if horizontal_offset >= 0 and vertical_offset >= 0:
                offset_frame.paste(frame, (x_offset, y_offset), frame)
            elif horizontal_offset >= 0 and vertical_offset < 0:
                offset_frame.paste(frame, (x_offset, 0), frame)
                # Part that goes above gets cut off (or we could wrap)
            elif horizontal_offset < 0 and vertical_offset >= 0:
                offset_frame.paste(frame, (0, y_offset), frame)
            else:  # both negative
                offset_frame.paste(frame, (0, 0), frame)

            frame = offset_frame

        # Paste frame into sprite sheet
        x_offset = i * frame_width
        sprite_sheet.paste(frame, (x_offset, 0), frame)
        print(f"  Frame {i+1}: offset ({horizontal_offset}, {vertical_offset}) px")

    # Save the sprite sheet
    try:
        sprite_sheet.save(sprite_sheet_path, "PNG")
        print(f"\nSprite sheet saved as: {sprite_sheet_path}")
        print(f"Size: {sprite_sheet.size[0]}x{sprite_sheet.size[1]} pixels")
        return True
    except Exception as e:
        print(f"Error saving sprite sheet: {e}")
        return False

def create_alternative_sprite_sheet():
    """
    Alternative approach: Create frames by modifying the image slightly
    to simulate leg movement (more complex but potentially better)
    """
    print("\n=== Alternative method: Frame modification ===")

    base_image_path = "./caballo.png"
    sprite_sheet_path = "./caballo-sprite-alt.png"

    if not os.path.exists(base_image_path):
        print(f"Error: Base image '{base_image_path}' not found!")
        return False

    try:
        base_image = Image.open(base_image_path).convert("RGBA")
        width, height = base_image.size
        frame_count = 8

        sprite_sheet = Image.new("RGBA", (frame_width * frame_count, frame_height), (0, 0, 0, 0))

        print("Creating alternative sprite sheet with frame modifications...")

        for i in range(frame_count):
            frame = base_image.copy()

            # Create a simple walking cycle by modifying the image
            # For a more sophisticated approach, we'd need to isolate legs,
            # but for now we'll do simple transformations

            # Apply different transformations per frame
            if i % 4 == 0:  # Frames 0, 4: normal
                pass
            elif i % 4 == 1:  # Frames 1, 5: slightly stretched horizontally
                # Simple scaling effect
                pass
            elif i % 4 == 2:  # Frames 2, 6: slightly compressed
                pass
            else:  # Frames 3, 7: back to normal
                pass

            # For now, just use the same image but we could enhance this
            x_offset = i * width
            sprite_sheet.paste(frame, (x_offset, 0), frame)
            print(f"  Frame {i+1}: processed")

        # Save alternative version
        sprite_sheet.save(sprite_sheet_path, "PNG")
        print(f"Alternative sprite sheet saved as: {sprite_sheet_path}")
        return True

    except Exception as e:
        print(f"Error creating alternative sprite sheet: {e}")
        return False

if __name__ == "__main__":
    print("=== Horse Sprite Sheet Generator ===")

    # Change to the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"Working in: {os.getcwd()}")

    # Generate primary sprite sheet
    success = create_horse_sprite_sheet()

    if success:
        print("\n✓ Sprite sheet generation completed successfully!")
        print("\nNext steps:")
        print("1. Rename or copy the generated file to replace any existing caballo-sprite.png")
        print("2. The code expects 8 frames in a horizontal strip")
        print("3. Refresh your browser to see the animation")
    else:
        print("\n✗ Sprite sheet generation failed!")

    # Optionally create alternative version
    # create_alternative_sprite_sheet()