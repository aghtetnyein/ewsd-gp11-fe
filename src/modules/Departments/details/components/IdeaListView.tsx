import { IdeaCard, IdeaCardSkeleton } from "@/components/common/IdeaCard";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import useAcademicYear from "@/hooks/useAcademicYear";
import { FEATURES, useAuthorize } from "@/hooks/useAuthorize";
import { showDialog } from "@/lib/utils";
import { useGetIdeaList } from "@/modules/Departments/details/api/queryGetIdeaList";
import IdeaForm from "@/modules/Departments/details/components/IdeaForm";
import { TIdea } from "@/types/idea";
import { format } from "date-fns";
import { File, Plus } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const IdeaListView = () => {
  const { id: departmentId } = useParams();
  const { checkFeatureAvailability } = useAuthorize();
  const { authState } = useAuth();
  const { isIdeaSubmissionOpen } = useAcademicYear();

  const [tab] = useQueryState("tab", parseAsString.withDefault("latest"));
  const [startDate] = useQueryState("startDate", parseAsString.withDefault(""));
  const [endDate] = useQueryState("endDate", parseAsString.withDefault(""));
  const [categoryId] = useQueryState(
    "categoryId",
    parseAsString.withDefault(""),
  );
  const [page, setPage] = useQueryState("page", parseAsString.withDefault("1"));
  const [perPage] = useQueryState("perPage", parseAsString.withDefault("10"));

  const startOfDay = startDate ? new Date(startDate) : new Date();
  startOfDay?.setHours(0, 0, 0, 0);

  const endOfDay = endDate ? new Date(endDate) : new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const orderBy = (tab: string) => {
    switch (tab) {
      case "latest":
        return "created_at";
      case "most-popular":
        return "likes_count";
      case "most-viewed":
        return "views";
      default:
        return "created_at";
    }
  };

  const { data: getIdeas, isLoading: isLoadingIdeas } = useGetIdeaList({
    params: {
      orderBy: orderBy(tab),
      categoryId: categoryId,
      startDate: startDate ? startOfDay.toISOString() : "",
      endDate: endDate ? endOfDay.toISOString() : "",
      page: Number(page),
      perPage: Number(perPage),
      departmentId,
      isHidden: authState?.userData?.role === "staff" ? true : false,
    },
    queryConfig: {
      enabled: true,
    },
  });

  const allIdeas = getIdeas?.body.data;

  function handleCreateNewIdea() {
    showDialog({
      title: "Create New Idea",
      children: <IdeaForm />,
    });
  }

  function handlePageChange(page: number) {
    setPage(page.toString());
  }

  const isUsingParams = useMemo(() => {
    return (
      !!categoryId ||
      (!!startDate && startDate !== format(new Date(), "yyyy-MM-dd")) ||
      (!!endDate && endDate !== format(new Date(), "yyyy-MM-dd"))
    );
  }, [categoryId, startDate, endDate]);

  return (
    <div className="space-y-4">
      {!isLoadingIdeas ? (
        <>
          {allIdeas.length > 0 ? (
            <>
              {allIdeas?.map((idea: TIdea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
              {/* Pagination */}
              <Pagination
                variant="simple"
                currentPage={Number(page)}
                totalPages={getIdeas?.body.last_page}
                pageSize={getIdeas?.body.per_page}
                totalItems={getIdeas?.body.total}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <>
              {!isUsingParams ? (
                <div className="border-weak mx-auto flex h-full w-full flex-col gap-y-8 rounded-xl border bg-white p-4 md:p-10">
                  <File size={40} />
                  <div className="space-y-2">
                    <p className="text-xl font-medium">No idea yet.</p>
                    <p className="text-brand text-sm">
                      Be the first to share your idea and help improve our
                      university! Your voice can make a difference.
                    </p>
                  </div>
                  {isIdeaSubmissionOpen &&
                    checkFeatureAvailability(FEATURES.CREATE_IDEA) && (
                      <div>
                        <Button type="button" onClick={handleCreateNewIdea}>
                          <Plus size={20} />
                          Create New Idea
                        </Button>
                      </div>
                    )}
                </div>
              ) : (
                <div className="border-weak mx-auto flex h-full w-full flex-col gap-y-8 rounded-xl border bg-white p-4 md:p-10">
                  <File size={40} />
                  <div className="space-y-2">
                    <p className="text-xl font-medium">
                      No idea found with the selected filters.
                    </p>
                    <p className="text-brand text-sm">
                      Please try different filters or create a new idea.
                    </p>
                  </div>
                  {isIdeaSubmissionOpen &&
                    checkFeatureAvailability(FEATURES.CREATE_IDEA) && (
                      <div>
                        <Button type="button" onClick={handleCreateNewIdea}>
                          <Plus size={20} />
                          Create New Idea
                        </Button>
                      </div>
                    )}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <IdeaCardSkeleton key={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default IdeaListView;
