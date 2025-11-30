"use client";

import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES } from "./countries";

export default function CountrySelector({
  id,
  value,
  onChange,
  disabled = false,
  priorityIso = null,
}) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const mutableRef = ref;
    const handleClickOutside = (event) => {
      if (mutableRef.current && !mutableRef.current.contains(event.target) && open) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = useMemo(() => COUNTRIES.find((c) => c.value === value) || COUNTRIES.find(c => c.value === 'US'), [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = COUNTRIES;
    if (q) {
      list = COUNTRIES.filter((c) => c.title.toLowerCase().startsWith(q) || c.value.toLowerCase().startsWith(q));
    }
    if (priorityIso) {
      const i = list.findIndex((c) => c.value === priorityIso);
      if (i > 0) {
        const copy = list.slice();
        const [u] = copy.splice(i, 1);
        copy.unshift(u);
        return copy;
      }
    }
    return list;
  }, [query, priorityIso]);

  return (
    <div ref={ref}>
      <div className="mt-1 relative">
        <button
          type="button"
          className={`${disabled ? "bg-neutral-100" : "bg-white"} relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          aria-haspopup="listbox"
          aria-expanded={open ? "true" : "false"}
          aria-labelledby={id}
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
        >
          <span className="truncate flex items-center">
            <img
              alt={`${selected.value}`}
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selected.value}.svg`}
              className={"inline mr-2 h-4 rounded-sm"}
            />
            {selected.title}
          </span>
          <span className={`absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none ${disabled ? "hidden" : ""}`}>
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {open && (
          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby={id}>
            <div className="sticky top-0 z-10 bg-white">
              <li className="text-gray-900 cursor-default select-none relative py-2 px-3">
                <input
                  type="search"
                  name="search"
                  autoComplete="off"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder={"Search a country"}
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                />
              </li>
              <hr />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9">No countries found</li>
              ) : (
                filtered.map((c, index) => (
                  <li
                    key={`${id}-${index}`}
                    className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 flex items-center hover:bg-gray-50 transition"
                    role="option"
                    onClick={() => {
                      onChange(c.value);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <img alt={`${c.value}`} src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${c.value}.svg`} className={"inline mr-2 h-4 rounded-sm"} />
                    <span className="font-normal truncate">{c.title}</span>
                    {c.value === selected.value ? (
                      <span className="text-blue-600 absolute inset-y-0 right-0 flex items-center pr-8">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : null}
                  </li>
                ))
              )}
            </div>
          </ul>
        )}
      </div>
    </div>
  );
}

