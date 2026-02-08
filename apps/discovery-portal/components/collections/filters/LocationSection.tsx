'use client';

import React from 'react';
import { SmartFilter, AccordionItem, AccordionTrigger, AccordionContent } from '@repo/ui';
import {
    useCountries,
    fetchCountries,
    fetchCountryById,
    fetchDepartments,
    fetchDepartmentById,
    fetchProvinces,
    fetchProvinceById,
    fetchDistricts,
    fetchDistrictById,
    fetchLocalities,
    fetchLocalityById,
} from '@repo/networking';
import { useQuery } from '@tanstack/react-query';
import { mapToOptions, useInitialOption } from './utils';

/**
 * LocationSection handles the hierarchy:
 * Country -> Department -> Province -> District -> Locality
 */
interface LocationSectionProps {
    searchParams: URLSearchParams;
    onUpdate: (updates: Record<string, string | null>) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ searchParams, onUpdate }) => {
    // === Param Access ===
    const countryId = searchParams.get('countryId');
    const departmentId = searchParams.get('departmentId');
    const provinceId = searchParams.get('provinceId');
    const districtId = searchParams.get('districtId');
    const localityId = searchParams.get('localityId');

    // === Data Fetching Initial Lists ===
    // Country is the root, so we fetch it always
    const { data: initialCountries } = useCountries({ pageSize: 20 });

    const { data: initialDepartments } = useQuery({
        queryKey: ['departments-initial', countryId],
        queryFn: () => fetchDepartments({ pageSize: 20, country_id: countryId || undefined }),
        enabled: !!countryId,
    });

    const { data: initialProvinces } = useQuery({
        queryKey: ['provinces-initial', departmentId],
        queryFn: () => fetchProvinces({ pageSize: 20, department_id: departmentId ? Number(departmentId) : undefined }),
        enabled: !!departmentId,
    });

    const { data: initialDistricts } = useQuery({
        queryKey: ['districts-initial', provinceId],
        queryFn: () => fetchDistricts({ pageSize: 20, province_id: provinceId ? Number(provinceId) : undefined }),
        enabled: !!provinceId,
    });

    const { data: initialLocalities } = useQuery({
        queryKey: ['localities-initial', districtId],
        queryFn: () => fetchLocalities({ pageSize: 20, district_id: districtId ? Number(districtId) : undefined }),
        enabled: !!districtId,
    });

    // === Options Setup (Initial + Selected) ===
    const selectedCountryOpt = useInitialOption(countryId, (id) => fetchCountryById(id), 'country-initial', initialCountries?.data);
    const selectedDepartmentOpt = useInitialOption(departmentId, (id) => fetchDepartmentById(Number(id)), 'department-initial', initialDepartments?.data);
    const selectedProvinceOpt = useInitialOption(provinceId, (id) => fetchProvinceById(Number(id)), 'province-initial', initialProvinces?.data);
    const selectedDistrictOpt = useInitialOption(districtId, (id) => fetchDistrictById(Number(id)), 'district-initial', initialDistricts?.data);
    const selectedLocalityOpt = useInitialOption(localityId, (id) => fetchLocalityById(Number(id)), 'locality-initial', initialLocalities?.data);

    // === Handlers (Cascade Logic) ===
    const handleCountryChange = (val: string | null) => {
        onUpdate({
            countryId: val,
            departmentId: null,
            provinceId: null,
            districtId: null,
            localityId: null,
        });
    };

    const handleDepartmentChange = (val: string | null) => {
        onUpdate({
            departmentId: val,
            provinceId: null,
            districtId: null,
            localityId: null,
        });
    };

    const handleProvinceChange = (val: string | null) => {
        onUpdate({
            provinceId: val,
            districtId: null,
            localityId: null,
        });
    };

    const handleDistrictChange = (val: string | null) => {
        onUpdate({
            districtId: val,
            localityId: null,
        });
    };

    const handleLocalityChange = (val: string | null) => {
        onUpdate({
            localityId: val,
        });
    };

    // Helper to render disabled inputs with hint
    const DisabledFilterHint = ({ label, parentLabel }: { label: string; parentLabel: string }) => (
        <div className="space-y-1">
            <label className="text-xs font-semibold tracking-wider text-slate-400">{label}</label>
            <p className="text-[10px] italic text-slate-400">
                * Seleccione {parentLabel} primero
            </p>
        </div>
    );

    return (
        <AccordionItem value="location" className="border-b-0">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">Ubicación</AccordionTrigger>
            <AccordionContent className="pt-2 px-1 flex flex-col gap-4 lg:gap-6">
                <div className="flex flex-col gap-2">
                    {/* COUNTRY */}
                    <SmartFilter
                        type="list-search"
                        label="País"
                        value={countryId}
                        onChange={handleCountryChange}
                        options={selectedCountryOpt.length > 0 ? selectedCountryOpt : mapToOptions(initialCountries?.data)}
                        loadOptions={async (query, page) => {
                            const res = await fetchCountries({ name: query, page, pageSize: 20 });
                            return {
                                options: mapToOptions(res.data),
                                hasMore: res.currentPage < res.totalPages,
                            };
                        }}
                        placeholder="Buscar país..."
                        hasMore={initialCountries ? initialCountries.currentPage < initialCountries.totalPages : false}
                    />

                    {/* DEPARTMENT */}
                    {countryId ? (
                        <SmartFilter
                            key={`dept-${countryId}`}
                            type="list-search"
                            label="Departamento"
                            value={departmentId}
                            onChange={handleDepartmentChange}
                            options={selectedDepartmentOpt.length > 0 ? selectedDepartmentOpt : mapToOptions(initialDepartments?.data)}
                            loadOptions={async (query, page) => {
                                const res = await fetchDepartments({
                                    name: query,
                                    page,
                                    pageSize: 20,
                                    country_id: countryId || undefined,
                                });
                                return {
                                    options: mapToOptions(res.data),
                                    hasMore: res.currentPage < res.totalPages,
                                };
                            }}
                            placeholder="Buscar departamento..."
                            hasMore={
                                initialDepartments ? initialDepartments.currentPage < initialDepartments.totalPages : false
                            }
                        />
                    ) : (
                        <DisabledFilterHint label="Departamento" parentLabel="un País" />
                    )}

                    {/* PROVINCE */}
                    {departmentId ? (
                        <SmartFilter
                            key={`prov-${departmentId}`}
                            type="list-search"
                            label="Provincia"
                            value={provinceId}
                            onChange={handleProvinceChange}
                            options={selectedProvinceOpt.length > 0 ? selectedProvinceOpt : mapToOptions(initialProvinces?.data)}
                            loadOptions={async (query, page) => {
                                const res = await fetchProvinces({
                                    name: query,
                                    page,
                                    pageSize: 20,
                                    department_id: Number(departmentId),
                                });
                                return {
                                    options: mapToOptions(res.data),
                                    hasMore: res.currentPage < res.totalPages,
                                };
                            }}
                            placeholder="Buscar provincia..."
                            hasMore={initialProvinces ? initialProvinces.currentPage < initialProvinces.totalPages : false}
                        />
                    ) : (
                        <DisabledFilterHint label="Provincia" parentLabel="un Departamento" />
                    )}

                    {/* DISTRICT */}
                    {provinceId ? (
                        <SmartFilter
                            key={`dist-${provinceId}`}
                            type="list-search"
                            label="Distrito"
                            value={districtId}
                            onChange={handleDistrictChange}
                            options={selectedDistrictOpt.length > 0 ? selectedDistrictOpt : mapToOptions(initialDistricts?.data)}
                            loadOptions={async (query, page) => {
                                const res = await fetchDistricts({
                                    name: query,
                                    page,
                                    pageSize: 20,
                                    province_id: Number(provinceId),
                                });
                                return {
                                    options: mapToOptions(res.data),
                                    hasMore: res.currentPage < res.totalPages,
                                };
                            }}
                            placeholder="Buscar distrito..."
                            hasMore={initialDistricts ? initialDistricts.currentPage < initialDistricts.totalPages : false}
                        />
                    ) : (
                        <DisabledFilterHint label="Distrito" parentLabel="una Provincia" />
                    )}

                    {/* LOCALITY */}
                    {districtId ? (
                        <SmartFilter
                            key={`loc-${districtId}`}
                            type="list-search"
                            label="Localidad"
                            value={localityId}
                            onChange={handleLocalityChange}
                            options={selectedLocalityOpt.length > 0 ? selectedLocalityOpt : mapToOptions(initialLocalities?.data)}
                            loadOptions={async (query, page) => {
                                const res = await fetchLocalities({
                                    name: query,
                                    page,
                                    pageSize: 20,
                                    district_id: Number(districtId),
                                });
                                return {
                                    options: mapToOptions(res.data),
                                    hasMore: res.currentPage < res.totalPages,
                                };
                            }}
                            placeholder="Buscar localidad..."
                            hasMore={initialLocalities ? initialLocalities.currentPage < initialLocalities.totalPages : false}
                        />
                    ) : (
                        <DisabledFilterHint label="Localidad" parentLabel="un Distrito" />
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
