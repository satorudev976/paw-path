# PawPath

**愛犬の散歩を記録・共有できる家族向けモバイルアプリ**

PawPath（パウパス）は、英語の「Paw（肉球）」＋「Path（道・ルート）」を組み合わせた造語です。


## ローカル開発

```
npx expo start
```

## Dev Client ビルド

```
npx eas build --profile development
```

## テスト配布

```
npx eas build --profile preview
```

## ストア提出

```
npx eas build --profile production
npx eas submit --profile production
```

## hostingデプロイ Dev
```
firebase use default
firebase deploy --only hosting
```

## hostingデプロイ Prod
```
firebase use prod
firebase deploy --only hosting
```
