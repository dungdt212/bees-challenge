import { useEffect, useState } from "react";

interface TUser {
  id: string;
  name: string;
  balance: number;
  email: string;
  registerAt: Date;
  active: boolean;
}

type SortKey = keyof Pick<TUser, "name" | "balance" | "email" | "registerAt">;
type SortDirection = "asc" | "desc" | null;

const PageTwo = () => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const lightModeStyle = "bg-white text-black";
  const darkModeStyle = "bg-gray-900 text-white";

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      // Fetch data from a public API
      try {
        const response = await fetch("https://dummyjson.com/users?limit=100");
        if (!response.ok) throw new Error("Failed to fetch users");
  
        const json = await response.json();
        const mappedUsers: TUser[] = json.users.map((user: any) => ({
          id: user.id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          balance: Math.floor(Math.random() * 100000),
          email: user.email,
          registerAt: new Date(user.birthDate),
          active: user.id % 2 === 0,
        }));
  
        // Implement a loading spinner
        setTimeout(() => {
          setUsers(mappedUsers);
          setLoading(false);
        }, 500); 
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  
  // Filter
  const filteredUsers = users.filter((user) => {
    if (filterStatus === "active") return user.active;
    if (filterStatus === "inactive") return !user.active;
    return true;
  });

  // Sort
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0;

    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
      );
      if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return "⇅";
    return sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : "⇅";
  };

  // Pagination
  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const isAllSelected = currentUsers.every((user) =>
    selectedNames.includes(user.name)
  );

  return (
    <div
      className={`p-6 max-w-6xl mx-auto min-h-screen transition-colors duration-300 ${
        darkMode ? darkModeStyle : lightModeStyle
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Table</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{darkMode ? "Light Mode" : "Dark Mode"}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-400 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-white text-lg">Loading users...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-red-600 font-semibold">
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <table className="w-full table-auto border border-collapse border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-500">
              <tr>
                <th className="border p-2 text-left dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={() =>
                        setSelectedNames(
                          isAllSelected ? [] : currentUsers.map((user) => user.name)
                        )
                      }
                    />
                    <span
                      className="cursor-pointer select-none hover:text-blue-300 transition"
                      onClick={() => handleSort("name")}
                    >
                      Name {getSortIcon("name")}
                    </span>
                  </div>
                </th>

                <th
                  className="border p-2 cursor-pointer text-right dark:border-gray-700 select-none hover:text-blue-300 transition"
                  onClick={() => handleSort("balance")}
                >
                  Balance {getSortIcon("balance")}
                </th>

                <th
                  className="border p-2 cursor-pointer text-center dark:border-gray-700 select-none hover:text-blue-300 transition"
                  onClick={() => handleSort("email")}
                >
                  Email {getSortIcon("email")}
                </th>

                <th
                  className="border p-2 cursor-pointer text-center dark:border-gray-700 select-none hover:text-blue-300 transition"
                  onClick={() => handleSort("registerAt")}
                >
                  Registration {getSortIcon("registerAt")}
                </th>

                <th className="border p-2 text-center dark:border-gray-700">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <span className="font-medium text-sm">Status</span>
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value as any);
                        setCurrentPage(1);
                      }}
                      className="border px-1.5 py-[2px] rounded text-xs dark:bg-gray-600 dark:text-white h-[24px] select-none hover:text-blue-300 transition"
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </th>


                <th className="border p-2 text-center dark:border-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-300"
                >
                  <td className="border p-2 dark:border-gray-700">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedNames.includes(user.name)}
                        onChange={() =>
                          setSelectedNames((prev) =>
                            prev.includes(user.name)
                              ? prev.filter((n) => n !== user.name)
                              : [...prev, user.name]
                          )
                        }
                      />
                      {user.name}
                    </label>
                  </td>
                  <td className="border p-2 text-right dark:border-gray-700">
                    ${user.balance.toLocaleString()}
                  </td>
                  <td className="border p-2 hover:text-blue-600 transition-colors duration-150 dark:border-gray-700">
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td
                    className="border p-2 dark:border-gray-700"
                    title={user.registerAt.toLocaleString()}
                  >
                    {user.registerAt.toISOString().split("T")[0]}
                  </td>
                  <td className="border p-2 text-center dark:border-gray-700">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        user.active
                          ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                          : "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="border  dark:border-gray-700">
                    <button
                      onClick={() => alert(`Update user ${user.id}: Handle later`)}
                      className="text-yellow-600 hover:text-yellow-800 p-1"
                      title="Update"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M4 20h4l10.586-10.586a2 2 0 00-2.828-2.828L6 17.172V20z" />
                      </svg>
                    </button>

                    <button
                      onClick={() =>
                        setUsers((prev) => prev.filter((u) => u.id !== user.id))
                      }
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <label htmlFor="rowsPerPage">Rows per page:</label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border px-2 py-1 rounded dark:bg-gray-400 dark:border-gray-700"
              >
                {[5, 10, 15, 20].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-2 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
              >
                ⟨
              </button>
              {[...Array(totalPages)].map((_, i) => {
                if (
                  i + 1 === 1 ||
                  i + 1 === totalPages ||
                  Math.abs(i + 1 - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                } else if (
                  i === 1 &&
                  currentPage > 3
                ) {
                  return <span key={i}>...</span>;
                } else if (
                  i === totalPages - 2 &&
                  currentPage < totalPages - 2
                ) {
                  return <span key={i}>...</span>;
                }
                return null;
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-2 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
              >
                ⟩
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PageTwo;
