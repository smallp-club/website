export type AddDeviceState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'added' };

export const initialAddDeviceState: AddDeviceState = { status: 'idle' };
