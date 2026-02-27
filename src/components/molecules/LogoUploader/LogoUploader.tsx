import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import './LogoUploader.styles.css';
import { Button } from '../../atoms';

type LogoUploaderProps = {
  id?: string;
  disabled?: boolean;
  initialPreviewUrl?: string | null;
  maxFileSizeMb?: number;
  maxWidth?: number;
  maxHeight?: number;
  onSelectFile?: (file: File | null) => void;
};

type ValidationConfig = {
  maxFileSizeMb: number;
  maxWidth: number;
  maxHeight: number;
};

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];

function formatBytesToMb(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function loadImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({ width: image.width, height: image.height });
      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo leer la imagen.'));
    };

    image.src = objectUrl;
  });
}

async function validateLogoFile(file: File, config: ValidationConfig): Promise<string | null> {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Formato inválido. Usa PNG, JPG o SVG.';
  }

  const maxBytes = config.maxFileSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return `El archivo supera ${config.maxFileSizeMb} MB (${formatBytesToMb(file.size)}).`;
  }

  try {
    const { width, height } = await loadImageDimensions(file);
    if (width > config.maxWidth || height > config.maxHeight) {
      return `Dimensiones máximas: ${config.maxWidth}x${config.maxHeight}px. Archivo: ${width}x${height}px.`;
    }
  } catch (error) {
    return error instanceof Error ? error.message : 'No se pudo validar la imagen.';
  }

  return null;
}

export function LogoUploader({
  id = 'team-logo',
  disabled = false,
  initialPreviewUrl = null,
  maxFileSizeMb = 2,
  maxWidth = 800,
  maxHeight = 800,
  onSelectFile,
}: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const revokePreviewUrl = (url: string | null) => {
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    return () => {
      revokePreviewUrl(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    revokePreviewUrl(previewUrl);
    setPreviewUrl(initialPreviewUrl);
    setFileName(initialPreviewUrl ? 'Logo actual' : null);
  }, [initialPreviewUrl]);

  const openFileSelector = () => {
    if (disabled || isValidating) {
      return;
    }
    inputRef.current?.click();
  };

  const resetSelection = () => {
    revokePreviewUrl(previewUrl);
    setPreviewUrl(null);
    setFileName(null);
    onSelectFile?.(null);
  };

  const handleSelectedFile = async (file?: File) => {
    if (!file || disabled) {
      return;
    }

    setIsValidating(true);
    setErrorMessage(null);

    const validationError = await validateLogoFile(file, {
      maxFileSizeMb,
      maxWidth,
      maxHeight,
    });

    if (validationError) {
      resetSelection();
      setErrorMessage(validationError);
      setIsValidating(false);
      return;
    }

    revokePreviewUrl(previewUrl);

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);
    setFileName(file.name);
    onSelectFile?.(file);
    setIsValidating(false);
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    await handleSelectedFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled && !isValidating) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (disabled || isValidating) {
      return;
    }

    await handleSelectedFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className={'logo-uploader'}>
      <div
        className={`logo-uploader__dropzone ${isDragging ? 'logo-uploader__dropzone--dragging' : ''} ${disabled ? 'logo-uploader__dropzone--disabled' : ''}`.trim()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id={id}
          type={'file'}
          accept={'.png,.jpg,.jpeg,.svg'}
          className={'logo-uploader__input'}
          onChange={handleChange}
          disabled={disabled || isValidating}
        />

        <div className={'logo-uploader__icon'} aria-hidden={'true'}>
          <svg viewBox="0 0 24 24" className={'logo-uploader__icon-svg'}>
            <path
              d="M7 17a4 4 0 0 1-.4-7.98A5.5 5.5 0 0 1 17.3 7.1 4.5 4.5 0 1 1 18 17H14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19V11m0 0-3 3m3-3 3 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className={'logo-uploader__title'}>Arrastra tu logo aquí</p>
        <p className={'logo-uploader__subtitle'}>
          PNG, JPG o SVG (Max. {maxWidth}x{maxHeight}px)
        </p>

        {previewUrl && (
          <div className={'logo-uploader__preview'}>
            <img
              src={previewUrl}
              alt={'Vista previa del logo'}
              className={'logo-uploader__preview-image'}
            />
            {fileName && <p className={'logo-uploader__file-name'}>{fileName}</p>}
          </div>
        )}

        <div className={'logo-uploader__actions'}>
          <Button
            className={'logo-uploader__button'}
            onClick={(event) => {
              event.stopPropagation();
              openFileSelector();
            }}
            disabled={disabled || isValidating}
          >
            <span className={'button-text'}>
              {isValidating ? 'Validando...' : previewUrl ? 'Cambiar logo' : 'Buscar archivo'}
            </span>
          </Button>
        </div>
      </div>

      {errorMessage && <p className={'logo-uploader__error'}>{errorMessage}</p>}
    </div>
  );
}
