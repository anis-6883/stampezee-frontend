import { Checkbox } from 'rizzui';

interface VideoItem {
  imageUrl: string;
  title: string;
  isChecked: boolean;
  id: string;
}

const VideoCard = ({
  id,
  imageUrl,
  title,
  isChecked,
  handleChange,
}: {
  id: string;
  imageUrl: string;
  title: string;
  isChecked: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}) => {
  return (
    <div className="mb-4 mr-4 max-w-xs rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <a href="#">
        <img className="rounded-t-lg" height={80} width="100%" src={imageUrl} alt="" />
      </a>
      <div className="p-2">
        <a href="#">
          <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        </a>
        <Checkbox
          name="id"
          label="checked"
          checked={isChecked}
          onChange={(event) => handleChange(event, id)}
          style={{ color: 'white' }}
          rounded="lg"
        />
      </div>
    </div>
  );
};

export default VideoCard;
