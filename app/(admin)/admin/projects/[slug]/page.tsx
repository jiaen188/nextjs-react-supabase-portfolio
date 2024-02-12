"use client";

import BlogForm from "@/components/BlogForm";
import { Blog } from "@/type";
import { useEffect, useReducer } from "react";

interface ParamProps {
  slug: string;
}

interface BlogDetailProps {
  params: ParamProps;
}

interface Response {
  data: Blog | null;
  loading: boolean;
}

export default function Page({ params }: BlogDetailProps) {
  const [response, setResponse] = useReducer(
    (prev: Response, next: Response) => {
      return { ...prev, ...next };
    },
    {
      data: null,
      loading: true,
    }
  );

  const fetchData = async () => {
    const response = await fetch(`/api/projects?id=${params.slug}`).then(
      (res) => res.json()
    );

    if (response.status === 200) {
      setResponse({ loading: false, data: response?.data });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (response.loading) {
    return <h1>loading...</h1>;
  }

  return (
    <BlogForm
      id={params.slug}
      value={response.data as Blog}
      variant="project"
    />
  );
}
