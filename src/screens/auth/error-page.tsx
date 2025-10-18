import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ErrorPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) => {
  const params = await searchParams;

  return (
    <div className="flex w-full flex-1 items-center justify-center p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Sorry, something went wrong.
            </CardTitle>
          </CardHeader>

          <CardContent>
            {params?.error ? (
              <p className="text-muted-foreground text-sm">
                Code error: {params.error}
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                An unspecified error occurred.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ErrorPage;
