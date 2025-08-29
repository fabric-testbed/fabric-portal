import { useRouter, usePathname } from "next/navigation"

const withRouter = (Component) => {
  return (props) => {
    const router = useRouter();
    const match = { params: router.query };
    const navigate = (url) => router.push(url);
    const location = {
      pathname: router.pathname,
      query: router.query,
      asPath: router.asPath,
    };

    return (
      <Component
        {...props}
        match={match}
        navigate={navigate}
        location={location}
      />
    );
  };
};

export default withRouter;
