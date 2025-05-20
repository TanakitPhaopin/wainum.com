import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';

export default function Review() {
    return (
        <div className="flex flex-col p-2 items-center justify-center h-auto bg-white rounded-xl shadow-[0_0_20px] shadow-black/30">
            <h1 className="text-xl font-semibolds">รีวิว</h1>
            <p className="text-3xl font-semibold">4.4</p>
            <Rating name="rating-read" defaultValue={2.5} precision={0.5} readOnly />
            {/* Review comments */}
            <div className='w-full mt-2'>
                <Stack
                    direction={"column"}
                    spacing={2}>
                    {/* Review items */}
                    <div className="flex flex-col gap-1">
                        <div className='flex flex-row items-center gap-2'>
                            <Avatar sx={{ bgcolor: 'purple' }}>OP</Avatar>
                            <div>
                                <p className="text-sm font-semibold">ชื่อผู้รีวิว</p>
                                <p className="text-xs">12/02/2025</p>   
                            </div>
                        </div>
                        <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.</p>
                    </div>
                    <div>Item 2</div>
                    <div>Item 3</div>
                </Stack>
            </div>
        </div>
    )
}