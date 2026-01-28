import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useInvite } from '@/hooks/use-invite';
import { InviteService } from '@/services/invite.service';

export function useUniversalLink() {
  const { setInviteData } = useInvite();

  useEffect(() => {
    // 初回URLの処理
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await handleInviteLink(initialUrl);
      }
    };

    // URLの変更を監視
    const subscription = Linking.addEventListener('url', async (event) => {
      await handleInviteLink(event.url);
    });

    handleInitialURL();

    return () => {
      subscription.remove();
    };
  }, []);

  const handleInviteLink = async (url: string) => {
    console.log('受信URL:', url);
    
    const { path, queryParams } = Linking.parse(url);
    
    // Universal Link: https://your-domain.web.app/invite?token=xxx
    if (path === 'invite' && queryParams?.token) {
      const token = queryParams.token as string;
      
      console.log('招待トークン受信:', token);
      
      // アプリ内でFirestoreから招待を検証
      const invite = await InviteService.getInvite(token);
      
      
      if (invite) {
        setInviteData(invite);
      }
      
    }
  };
}