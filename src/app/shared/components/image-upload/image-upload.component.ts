import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  /** Pass an existing image URL (e.g. from API) to pre-populate the preview */
  @Input() existingImageUrl: string | null = null;

  /** Max allowed file size in bytes (default: 5 MB) */
  @Input() maxFileSizeBytes: number = 5 * 1024 * 1024;

  /** Emits the selected File object so the parent can attach it to a form / API call */
  @Output() fileSelected = new EventEmitter<File>();

  /** Emits the base-64 data-URL so the parent can show a preview anywhere it likes */
  @Output() previewChanged = new EventEmitter<string | null>();

  /** Emits when the user explicitly removes the image */
  @Output() fileRemoved = new EventEmitter<void>();

  // ── internal state ────────────────────────────────────────────────────────
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  errorMessage: string | null = null;

  // ── lifecycle ─────────────────────────────────────────────────────────────
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['existingImageUrl']) {
      // Only set the preview from the input when the user hasn't already
      // chosen a new local file.
      if (!this.selectedFile) {
        this.imagePreview = this.existingImageUrl;
      }
    }
  }

  // ── handlers ──────────────────────────────────────────────────────────────
  onFileSelected(event: Event): void {
    this.errorMessage = null;
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select a valid image file.';
      return;
    }

    if (file.size > this.maxFileSizeBytes) {
      const mb = (this.maxFileSizeBytes / (1024 * 1024)).toFixed(0);
      this.errorMessage = `File size must not exceed ${mb} MB.`;
      return;
    }

    this.selectedFile = file;
    this.fileSelected.emit(file);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      this.imagePreview = result;
      this.previewChanged.emit(result);
    };
    reader.readAsDataURL(file);

    // Reset input so selecting the same file again triggers the change event
    input.value = '';
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.imagePreview = null;
    this.errorMessage = null;
    this.previewChanged.emit(null);
    this.fileRemoved.emit();
  }
}
