import PostsFeed from "@/components/posts/posts-feed";
import { Text } from "@/components/ui/text";
import { useTranslations } from "next-intl";

const HomePage = () => {
  const t = useTranslations("HomePage");

  return (
    <div className="container mx-auto flex max-w-xl flex-col gap-4 p-4">
      <Text className="text-center">{t("title")}</Text>

      <PostsFeed />
    </div>
  );
};

export default HomePage;
