import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FileInput } from '../model/file-input.model';

export class FileValidator {
  /**
   * Function to control content of files
   *
   * @param bytes max number of bytes allowed
   *
   * @returns
   */
  public static maxContentSize(bytes: number): ValidatorFn {
    return (
      control: AbstractControl<FileInput>,
    ): { maxContentSize: { actualSize: number; maxSize: number } } | null => {
      const size =
        control && control.value && control.value.files
          ? control.value.files.map((f) => f.size).reduce((acc, i) => acc + i, 0)
          : 0;
      const condition = bytes >= size;
      return condition
        ? null
        : {
            maxContentSize: {
              actualSize: size,
              maxSize: bytes,
            },
          };
    };
  }
}
