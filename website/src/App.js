import React from "react";
import useSWR from 'swr';


function App () {
  const [search, setSearch] = React.useState('');
  const { data, error, isLoading } = useSWR(`/history?search=${search}`)

  return (
    <div>
      <input value={search} onInput={e => setSearch(e.target.value)}/>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  )
}

export default App;
