const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-black rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;