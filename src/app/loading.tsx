import { ProgressSpinner } from 'primereact/progressspinner';

export default function Loading() {
    return (
        <div className='flex flex-col justify-center items-center h-[90vh]'>
            <ProgressSpinner />
        </div>
      );
}
