import ShowMenu from '@/src/app/components/restaurant/restaurant-menu';
import { useLocalSearchParams } from 'expo-router';

const SetMenuScreen = () => {
  const { planid,userflag,userid } = useLocalSearchParams();
  const flagValue = userflag === 'true';
  console.log(userid,"userid");
  return <ShowMenu id={planid} userid={userid} flag={flagValue} />;
};

export default SetMenuScreen;
