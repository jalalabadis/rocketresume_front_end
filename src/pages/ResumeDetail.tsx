import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ResumeData } from "../types/resume";
import BASE_URL from "../config/baseUrl";
import ResumePreview from "../components/ResumePreview";

const ResumeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No resume ID provided");
      setLoading(false);
      return;
    }

    const fetchResumeDetail = async () => {
      try {
        // Adjust the URL if needed.
        const url = `${BASE_URL}/addresume/getallresumes/${id}`;
        console.log("Fetching resume detail from:", url);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to fetch resume detail");
        }

        const data = await response.json();
        console.log("Received resume detail:", data);
        // Since the API returns an array, we pick the first match.
        if (Array.isArray(data) && data.length > 0) {
          setResume(data[0]);
        } else {
          throw new Error("Resume not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch resume detail"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResumeDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 text-center">
          Loading resume...
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 text-center text-red-500">
          {error || "Resume not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Resume Detail</h1>
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <ResumePreview data={resume} />
        </div>
        <div className="mt-6">
          <Link
            to="/saved-resumes"
            className="px-4 py-2 bg-primary-600 text-white rounded-md"
          >
            Back to Saved Resumes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetail;
